import { Poll } from './types';

export function getPolls(): Poll[] { return []; }
export function getPoll(_id: string): Poll | undefined { return undefined; }
export function createPoll(_data: { question: string; creator: string; options: string[] }): Poll {
  return { id: '', question: '', creator: '', status: 'open', options: [], createdAt: '' };
}
export function vote(_pollId: string, _optionId: string): { poll?: Poll; error?: string; status?: number } { return { error: 'not found', status: 404 }; }
export function closePoll(_pollId: string): Poll | null { return null; }
export function __reset() {}
