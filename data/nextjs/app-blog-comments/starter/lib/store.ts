import type { Comment, Post } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `posts`, `comments`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listComments(_filter?: { status?: string | null; postId?: string | null }): Comment[] {
  // TODO: return comments, applying optional status + postId filters
  return []
}

export function createComment(_input: { postId: string; author: string; body?: string }): Comment {
  // TODO: append a new comment (status 'pending') with a fresh id and return it
  return { id: '', postId: '', author: '', body: '', status: 'pending' }
}

export function findComment(_id: string): Comment | undefined {
  // TODO: look up a comment by id
  return undefined
}

export function updateComment(_id: string, _patch: { status?: string }): Comment | undefined {
  // TODO: apply the status patch and return the updated comment, or undefined if absent
  return undefined
}

export function deleteComment(_id: string): boolean {
  // TODO: remove the comment; return whether it existed
  return false
}

export function listPosts(): Post[] {
  // TODO: return all posts
  return []
}
