import type { Article, Category } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `articles` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listArticles(_filter?: { category?: string | null; q?: string | null }): Article[] {
  // TODO: return articles, applying optional category + q (title/body) filters
  return []
}

export function createArticle(_input: { title: string; body?: string; category?: Category }): Article {
  // TODO: append a new article with a fresh id and zeroed votes
  return { id: '', title: '', body: '', category: 'general', helpful: 0, notHelpful: 0 }
}

export function findArticle(_id: string): Article | undefined {
  // TODO: look up an article by id
  return undefined
}

export function updateArticle(
  _id: string,
  _patch: { vote?: 'helpful' | 'notHelpful'; title?: string; body?: string; category?: Category },
): Article | undefined {
  // TODO: apply the patch (incl. vote increments) and return it, or undefined if absent
  return undefined
}

export function deleteArticle(_id: string): boolean {
  // TODO: remove the article; return whether it existed
  return false
}
