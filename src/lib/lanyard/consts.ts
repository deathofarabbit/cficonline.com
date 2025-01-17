export const SOCKET_URL = 'wss://api.lanyard.rest/socket';

export enum LanyardOpcode {
	Event = 0,
	Hello = 1,
	Initialize = 2,
	Heartbeat = 3,
}