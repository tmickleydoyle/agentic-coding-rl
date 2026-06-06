import { Room, Message } from './types';

export function getRooms(): Room[] { return []; }
export function getRoom(_id: string): Room | undefined { return undefined; }
export function sendMessage(_roomId: string, _data: { author: string; body: string }): Message | null { return null; }
export function joinRoom(_roomId: string, _username: string): string[] | null { return null; }
export function __reset() {}
