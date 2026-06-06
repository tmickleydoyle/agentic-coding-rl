import { Proposal } from './types';

export function getProposals(): Proposal[] { return []; }
export function getProposal(_id: string): Proposal | undefined { return undefined; }
export function createProposal(_data: { title: string; description: string; author: string; category: string }): Proposal {
  return { id: '', title: '', description: '', author: '', category: 'Other', upvotes: 0, downvotes: 0, status: 'open', createdAt: '' };
}
export function upvote(_id: string): { upvotes?: number; score?: number; error?: string; status?: number } { return { error: 'not found', status: 404 }; }
export function downvote(_id: string): { downvotes?: number; score?: number; error?: string; status?: number } { return { error: 'not found', status: 404 }; }
export function __reset() {}
