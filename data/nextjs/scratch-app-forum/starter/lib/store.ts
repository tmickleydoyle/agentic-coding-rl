import { Thread, Reply } from './types';

export function getThreads(): Thread[] { return []; }
export function getThread(_id: string): Thread | undefined { return undefined; }
export function createThread(_data: { title: string; body: string; author: string; category: string }): Thread {
  return { id: '', title: '', body: '', author: '', category: 'General', upvotes: 0, replies: [], createdAt: '' };
}
export function addReply(_threadId: string, _data: { author: string; body: string }): Reply | null { return null; }
export function upvoteThread(_id: string): number | null { return null; }
export function upvoteReply(_threadId: string, _replyId: string): number | null { return null; }
export function __reset() {}
