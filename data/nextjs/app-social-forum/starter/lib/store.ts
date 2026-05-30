import type { Category, Reply, Thread } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level categories/threads/replies + id and createdAt counters; seed
// them; provide __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listCategories(): Category[] {
  // TODO: return all categories
  return []
}

export function listThreads(_filter?: {
  categoryId?: string | null
  sort?: string | null
}): Thread[] {
  // TODO: return threads, applying optional categoryId filter and votes/recent sort
  return []
}

export function createThread(_input: { title: string; categoryId?: string }): Thread {
  // TODO: append a thread (votes 0, increasing createdAt) with a fresh id and return it
  return { id: '', title: '', categoryId: '', votes: 0, createdAt: 0 }
}

export function findThread(_id: string): Thread | undefined {
  // TODO: look up a thread by id
  return undefined
}

export function upvoteThread(_id: string): Thread | undefined {
  // TODO: +1 votes; return the thread or undefined if absent
  return undefined
}

export function deleteThread(_id: string): boolean {
  // TODO: remove the thread; return whether it existed
  return false
}

export function listReplies(_threadId: string): Reply[] {
  // TODO: return replies for a thread
  return []
}

export function createReply(_input: { threadId: string; text: string }): Reply {
  // TODO: append a reply (votes 0) with a fresh id and return it
  return { id: '', threadId: '', text: '', votes: 0 }
}
