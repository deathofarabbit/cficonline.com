import type { LanyardOpcode } from "@/lib/lanyard/consts";

export interface LanyardOptions {
	id: string;
}

export type LanyardEvent = 'INIT_STATE' | 'PRESENCE_UPDATE';

export interface LanyardSocketResponse {
	op: LanyardOpcode;
	seq: number;
	t: LanyardEvent;
	d: HeartbeatData;
}

export interface HeartbeatData {
	heartbeat_interval: number;
}


