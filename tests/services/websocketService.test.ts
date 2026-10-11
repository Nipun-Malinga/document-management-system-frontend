import type { Client, IFrame, IMessage, StompConfig } from "@stomp/stompjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WebSocketService from "@/services/websocketService";
import {
	commitRefresh,
	endSession,
	getSession,
	markRecovering,
	replaceAccessToken,
} from "@/states/sessionStore";
import { requireValue } from "../assertions";
import { claims, tokenFor } from "../fixtures";

const mocks = vi.hoisted(() => ({ clients: [] as FakeClient[] }));
class FakeClient {
	active = false;
	connected = false;
	connectHeaders: Record<string, string> = {};
	handlers: { destination: string; callback: (message: IMessage) => void }[] =
		[];
	options: StompConfig;
	constructor(options: StompConfig) {
		this.options = options;
		mocks.clients.push(this);
	}
	activate = vi.fn(() => {
		this.active = true;
	});
	deactivate = vi.fn(async () => {
		this.active = false;
		this.connected = false;
		this.options.onWebSocketClose?.({} as CloseEvent);
	});
	subscribe = vi.fn(
		(destination: string, callback: (message: IMessage) => void) => {
			this.handlers.push({ destination, callback });
			return { id: String(this.handlers.length), unsubscribe: vi.fn() };
		},
	);
	publish = vi.fn();
	async connect() {
		await this.options.beforeConnect?.(this as unknown as Client);
		if (!this.active) return;
		this.connected = true;
		this.options.onConnect?.({} as IFrame);
	}
	close() {
		this.connected = false;
		this.options.onWebSocketClose?.({} as CloseEvent);
	}
	emit(destination: string) {
		for (const handler of this.handlers)
			if (handler.destination === destination)
				handler.callback({ body: "true" } as IMessage);
	}
}
vi.mock("@stomp/stompjs", () => ({
	// A constructable function defers access to the fake until after Vitest initializes imports.
	Client: function ClientMock(options: StompConfig) {
		return new FakeClient(options);
	},
}));

beforeEach(() => {
	mocks.clients.length = 0;
	replaceAccessToken(tokenFor());
});
afterEach(() => {
	endSession();
});
const connected = async (service: WebSocketService) => {
	const client = requireValue(mocks.clients.at(-1));
	await vi.waitFor(() => expect(client.active).toBe(true));
	await client.connect();
	return { service, client };
};

describe("managed STOMP sessions and subscriptions", () => {
	it("cancels a pending listener before connection with no later callback", async () => {
		const service = WebSocketService.getInstance();
		const callback = vi.fn();
		const unsubscribe = service.subscribe("/user/1/status", callback);
		unsubscribe();
		await Promise.resolve();
		const client = mocks.clients[0];
		expect(client.activate).not.toHaveBeenCalled();
		await client.connect();
		expect(client.subscribe).not.toHaveBeenCalled();
		expect(callback).not.toHaveBeenCalled();
	});

	it("registers once per connection, restores on reconnect, and blocks old callbacks", async () => {
		const service = WebSocketService.getInstance();
		const callback = vi.fn();
		const unsubscribe = service.subscribe("/user/1/status", callback);
		const { client } = await connected(service);
		expect(client.subscribe).toHaveBeenCalledTimes(1);
		client.options.onConnect?.({} as IFrame);
		expect(client.subscribe).toHaveBeenCalledTimes(1);
		client.emit("/user/1/status");
		expect(callback).toHaveBeenCalledTimes(1);
		client.close();
		await client.connect();
		expect(client.subscribe).toHaveBeenCalledTimes(2);
		client.emit("/user/1/status");
		expect(callback).toHaveBeenCalledTimes(2);
		unsubscribe();
		client.emit("/user/1/status");
		expect(callback).toHaveBeenCalledTimes(2);
		expect(
			client.subscribe.mock.results[1].value.unsubscribe,
		).toHaveBeenCalledOnce();
	});

	it("cleans up one listener without disrupting another and restores only active listeners", async () => {
		const service = WebSocketService.getInstance();
		const first = vi.fn();
		const second = vi.fn();
		const removeFirst = service.subscribe("/one", first);
		const removeSecond = service.subscribe("/two", second);
		const { client } = await connected(service);
		removeFirst();
		client.close();
		await client.connect();
		client.emit("/one");
		client.emit("/two");
		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledOnce();
		expect(
			client.subscribe.mock.calls.map(([destination]) => destination),
		).toEqual(["/one", "/two", "/two"]);
		removeSecond();
	});

	it("refreshes CONNECT headers and retains subscriptions across credential renewal", async () => {
		const service = WebSocketService.getInstance();
		const callback = vi.fn();
		const reset = vi.fn();
		const cleanup = service.subscribe("/user/1/status", callback, reset);
		const { client } = await connected(service);
		expect(client.connectHeaders.Authorization).toBe(`Bearer ${tokenFor()}`);
		const epoch = getSession().epoch;
		const nextToken = tokenFor({ ...claims, exp: claims.exp + 3600 });
		markRecovering(epoch);
		expect(client.active).toBe(false);
		client.emit("/user/1/status");
		expect(callback).not.toHaveBeenCalled();
		commitRefresh(nextToken, epoch);
		await vi.waitFor(() => expect(client.activate).toHaveBeenCalledTimes(2));
		await client.connect();
		expect(client.connectHeaders.Authorization).toBe(`Bearer ${nextToken}`);
		expect(client.subscribe).toHaveBeenCalledTimes(2);
		expect(reset).toHaveBeenCalled();
		cleanup();
	});

	it("reconnects for cross-tab token renewal even without an intermediate recovering status", async () => {
		const service = WebSocketService.getInstance();
		const cleanup = service.subscribe("/private", vi.fn());
		const { client } = await connected(service);
		const next = tokenFor({ ...claims, exp: claims.exp + 3600 });
		commitRefresh(next, getSession().epoch);
		await vi.waitFor(() => expect(client.activate).toHaveBeenCalledTimes(2));
		await client.connect();
		expect(client.connectHeaders.Authorization).toBe(`Bearer ${next}`);
		expect(client.subscribe).toHaveBeenCalledTimes(2);
		cleanup();
	});

	it("destroys old-account sockets, presence and listeners before account B connects", async () => {
		const service = WebSocketService.getInstance();
		const callback = vi.fn();
		const reset = vi.fn();
		service.subscribe("/private", callback, reset);
		const { client } = await connected(service);
		const tokenB = tokenFor({ ...claims, sub: "2" });
		replaceAccessToken(tokenB);
		expect(client.active).toBe(false);
		expect(reset).toHaveBeenCalled();
		client.emit("/private");
		expect(callback).not.toHaveBeenCalled();
		const next = WebSocketService.getInstance();
		expect(next).not.toBe(service);
		const cleanup = next.subscribe("/account-b", callback);
		const { client: clientB } = await connected(next);
		expect(clientB.connectHeaders.Authorization).toBe(`Bearer ${tokenB}`);
		expect(
			clientB.subscribe.mock.calls.map(([destination]) => destination),
		).toEqual(["/account-b"]);
		await client.connect();
		expect(client.active).toBe(false);
		cleanup();
	});
});
