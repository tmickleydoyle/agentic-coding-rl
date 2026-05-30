import type { Comment, Post, User } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level users/posts/comments + id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listUsers(): User[] {
  // TODO: return all users
  return []
}

export function listPosts(_filter?: { authorId?: string | null }): Post[] {
  // TODO: return posts, applying an optional authorId filter
  return []
}

export function createPost(_input: { authorId: string; text: string }): Post {
  // TODO: append a new post (likes 0, likedByMe false) with a fresh id and return it
  return { id: '', authorId: '', text: '', likes: 0, likedByMe: false }
}

export function findPost(_id: string): Post | undefined {
  // TODO: look up a post by id
  return undefined
}

export function setLiked(_id: string, _liked?: boolean): Post | undefined {
  // TODO: set/toggle likedByMe, adjusting likes when it changes; undefined if absent
  return undefined
}

export function deletePost(_id: string): boolean {
  // TODO: remove the post; return whether it existed
  return false
}

export function listComments(_postId: string): Comment[] {
  // TODO: return comments for a post
  return []
}

export function createComment(_input: { postId: string; authorId: string; text: string }): Comment {
  // TODO: append a new comment with a fresh id and return it
  return { id: '', postId: '', authorId: '', text: '' }
}
