import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';

class WebSocketService {
  private client: Client;

  private static instance: WebSocketService | null = null;

  private constructor() {
    const token = localStorage.getItem('jwt-access-token');

    this.client = new Client({
      brokerURL: import.meta.env.VITE_SERVER_WEBSOCKET_URL,
      connectHeaders: { Authorization: `Bearer ${token ?? ''}` },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Websocket Connected');
      },
    });

    this.client.activate();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public getClient(): Client {
    return this.client;
  }

  public connect(): void {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  public disconnect(): void {
    if (this.client.active) {
      this.client.deactivate();
    }
  }

  public subscribe(
    destination: string,
    callback: (msg: IMessage) => void
  ): StompSubscription {
    return this.client.subscribe(destination, callback);
  }

  public send(destination: string, body: any): void {
    if (this.client.connected) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    } else {
      console.warn('Cannot send message — STOMP not connected');
    }
  }

  public subscribeManager(method: () => StompSubscription) {
    if (!method) return;

    let subscription: StompSubscription;
    if (this.client.connected) subscription = method();
    else {
      const originalOnConnect = this.client.onConnect;
      this.client.onConnect = (frame) => {
        if (originalOnConnect) originalOnConnect(frame);
        subscription = method();
        this.client.onConnect = originalOnConnect;
      };
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }
}

export default WebSocketService;
