import { Article } from './types';

export function getArticles(): Article[] { return []; }
export function getArticle(_id: string): Article | undefined { return undefined; }
export function createArticle(_data: { title: string; body: string; author: string; tags: string[] }): Article {
  return { id: '', title: '', body: '', author: '', tags: [], revisions: [], createdAt: '', updatedAt: '' };
}
export function editArticle(_id: string, _data: { body: string; editedBy: string }): Article | null { return null; }
export function __reset() {}
