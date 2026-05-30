import type { Category, Post } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `posts`, `categories`, and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listPosts(_filter?: { status?: string | null; categoryId?: string | null }): Post[] {
  // TODO: return posts, applying optional status + categoryId filters
  return []
}

export function createPost(_input: {
  title: string
  body?: string
  categoryId?: string
  status?: string
}): Post {
  // TODO: append a new post (default status 'draft') with a fresh id and return it
  return { id: '', title: '', body: '', categoryId: '', status: 'draft' }
}

export function findPost(_id: string): Post | undefined {
  // TODO: look up a post by id
  return undefined
}

export function updatePost(
  _id: string,
  _patch: { title?: string; body?: string; categoryId?: string; status?: string },
): Post | undefined {
  // TODO: apply the patch and return the updated post, or undefined if absent
  return undefined
}

export function deletePost(_id: string): boolean {
  // TODO: remove the post; return whether it existed
  return false
}

export function listCategories(): Category[] {
  // TODO: return all categories
  return []
}

export function createCategory(_input: { name: string }): Category {
  // TODO: append a new category with a fresh id and return it
  return { id: '', name: '' }
}
