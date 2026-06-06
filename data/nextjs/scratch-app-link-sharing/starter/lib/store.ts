import { Link, Comment } from './types';

export function getLinks(): Link[] { return []; }
export function getLink(_id: string): Link | undefined { return undefined; }
export function createLink(_data: { title: string; url: string; submitter: string; category: string }): Link {
  return { id: '', title: '', url: '', submitter: '', category: 'Other', upvotes: 0, comments: [], createdAt: '' };
}
export function upvoteLink(_id: string): number | null { return null; }
export function addComment(_linkId: string, _data: { author: string; body: string }): Comment | null { return null; }
export function __reset() {}
