import { LanyardOpcode, SOCKET_URL } from '@/lib/lanyard/consts';
import type { LanyardEvent, LanyardOptions, LanyardSocketResponse } from '@/lib/lanyard/types';

type SocketCallback = (data: LanyardSocketResponse) => void;
type SocketEvent = LanyardEvent | 'message' | 'error';

export class Lanyard {
	private opts: LanyardOptions;
	private ws: WebSocket;
	private heartbeatInterval: NodeJS.Timer | undefined;
	private callbacks: Map<SocketEvent, SocketCallback[]> = new Map();

	constructor(opts: LanyardOptions) {
		this.opts = opts;
		this.ws = new WebSocket(SOCKET_URL);
		this.ws.onmessage = this.onMessage.bind(this);
	}

	private onMessage(event: MessageEvent) {
		const data = JSON.parse(event.data) as LanyardSocketResponse;

		if (data.op === LanyardOpcode.Hello) {
			// send init packet
			this.ws.send(JSON.stringify({
				op: LanyardOpcode.Initialize,
				d: {
					subscribe_to_id: this.opts.id
				}
			}));

			// set heartbeat interval
			this.heartbeatInterval = setInterval(() => {
				this.ws.send(JSON.stringify({
					op: LanyardOpcode.Heartbeat,
				}));
			}, data.d.heartbeat_interval);
		}

		// generic callbacks
		const msgCallbacks = this.callbacks.get('message') || [];
		msgCallbacks.forEach((callback) => callback(data));

		// specific
		const eventCallbacks = this.callbacks.get(data.t) || [];
		eventCallbacks.forEach((callback) => callback(data));
	}

	public close() {
		clearInterval(this.heartbeatInterval);
		this.ws.close();
	}

	public on(event: SocketEvent, callback: SocketCallback): void {
		const callbacks: SocketCallback[] = this.callbacks.get(event) || [];
		callbacks.push(callback);
		this.callbacks.set(event, callbacks);
	}
}
