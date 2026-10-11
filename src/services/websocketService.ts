import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import {
	assertSession,
	getSession,
	useSessionStore,
} from "@/states/sessionStore";
import { ensureAccessToken } from "./apiService";

interface Listener {
	destination: string;
	callback: (message: IMessage) => void;
	reset?: () => void;
	subscription?: StompSubscription;
}

class WebSocketService {
	private static instance: WebSocketService | null = null;
	private client: Client;
	private epoch = getSession().epoch;
	private listeners = new Map<number, Listener>();
	private nextId = 0;
	private connection = 0;
	private connected = false;
	private disposed = false;
	private transition = 0;
	private stopping: Promise<void> = Promise.resolve();
	private unsubscribeSession: () => void;

	private constructor() {
		this.client = new Client({
			brokerURL: import.meta.env.VITE_SERVER_WEBSOCKET_URL,
			reconnectDelay: 5000,
			beforeConnect: async () => {
				try {
					const token = await ensureAccessToken(this.epoch);
					if (this.disposed) return;
					assertSession(this.epoch);
					this.client.connectHeaders = { Authorization: `Bearer ${token}` };
				} catch {
					void this.pause();
				}
			},
			onConnect: () => {
				if (
					this.disposed ||
					getSession().epoch !== this.epoch ||
					getSession().status !== "authenticated"
				) {
					void this.pause();
					return;
				}
				if (this.connected) return;
				this.connected = true;
				this.connection++;
				for (const [id, listener] of this.listeners) {
					this.attach(id, listener);
				}
			},
			onWebSocketClose: () => this.resetSubscriptions(),
		});
		this.unsubscribeSession = useSessionStore.subscribe((state, previous) => {
			if (state.epoch !== this.epoch) this.dispose();
			else if (state.status === "recovering") void this.pause();
			else if (
				state.status === "authenticated" &&
				(state.token !== previous.token || state.status !== previous.status)
			) {
				if (previous.status === "authenticated") void this.pause();
				void this.resume();
			}
		});
	}

	public static getInstance() {
		if (!WebSocketService.instance)
			WebSocketService.instance = new WebSocketService();
		return WebSocketService.instance;
	}

	private resetSubscriptions() {
		this.connected = false;
		this.connection++;
		for (const listener of this.listeners.values()) {
			listener.subscription = undefined;
			listener.reset?.();
		}
	}
	private pause() {
		this.transition++;
		this.resetSubscriptions();
		this.stopping = this.client.deactivate({ force: true });
		return this.stopping;
	}
	private async resume() {
		const transition = ++this.transition;
		await this.stopping;
		if (
			this.disposed ||
			transition !== this.transition ||
			!this.listeners.size ||
			getSession().epoch !== this.epoch
		)
			return;
		if (getSession().status === "authenticated" && !this.client.active)
			this.client.activate();
	}
	private attach(id: number, listener: Listener) {
		if (listener.subscription || !this.client.connected || this.disposed)
			return;
		const connection = this.connection;
		listener.subscription = this.client.subscribe(
			listener.destination,
			(message) => {
				if (
					this.disposed ||
					getSession().epoch !== this.epoch ||
					getSession().status !== "authenticated" ||
					connection !== this.connection ||
					this.listeners.get(id) !== listener
				)
					return;
				listener.callback(message);
			},
		);
	}

	// Registration exists even before CONNECT; cleanup removes pending and active work.
	public subscribe(
		destination: string,
		callback: (message: IMessage) => void,
		reset?: () => void,
	) {
		if (this.disposed || getSession().epoch !== this.epoch) return () => {};
		const id = ++this.nextId;
		const listener: Listener = { destination, callback, reset };
		this.listeners.set(id, listener);
		this.attach(id, listener);
		void this.resume();
		return () => {
			this.listeners.delete(id);
			if (this.client.connected) listener.subscription?.unsubscribe();
			listener.subscription = undefined;
			if (!this.listeners.size) void this.pause();
		};
	}
	public send(destination: string, body: string) {
		if (
			!this.disposed &&
			getSession().epoch === this.epoch &&
			getSession().status === "authenticated" &&
			this.client.connected
		) {
			this.client.publish({ destination, body });
		}
	}
	public dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.unsubscribeSession();
		void this.pause();
		this.listeners.clear();
		if (WebSocketService.instance === this) WebSocketService.instance = null;
	}
}
export default WebSocketService;
