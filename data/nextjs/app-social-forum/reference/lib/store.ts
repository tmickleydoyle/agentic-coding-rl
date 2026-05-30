import type { Category, Reply, Thread } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach so each test starts from the same seed.

let categories: Category[] = []
let threads: Thread[] = []
let replies: Reply[] = []
let nextThreadId = 1
let nextReplyId = 1
let nextCreatedAt = 1

function seed(): void {
  categories = [
    { id: 'g1', name: 'General' },
    { id: 'g2', name: 'Help' },
    { id: 'g3', name: 'Showoff' },
  ]
  threads = [
    { id: 't1', title: 'Welcome thread', categoryId: 'g1', votes: 5, createdAt: 1 },
    { id: 't2', title: 'How do I deploy?', categoryId: 'g2', votes: 2, createdAt: 2 },
    { id: 't3', title: 'Look what I built', categoryId: 'g3', votes: 8, createdAt: 3 },
  ]
  replies = [
    { id: 'r1', threadId: 't1', text: 'Hi there!', votes: 1 },
    { id: 'r2', threadId: 't2', text: 'Try the CLI', votes: 3 },
    { id: 'r3', threadId: 't1', text: 'Me too', votes: 0 },
  ]
  nextThreadId = 4
  nextReplyId = 4
  nextCreatedAt = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listCategories(): Category[] {
  return categories.slice()
}

export function listThreads(filter?: {
  categoryId?: string | null
  sort?: string | null
}): Thread[] {
  let out = threads.slice()
  const categoryId = filter?.categoryId
  if (categoryId) out = out.filter((t) => t.categoryId === categoryId)
  const sort = filter?.sort
  if (sort === 'votes') out.sort((a, b) => b.votes - a.votes)
  else if (sort === 'recent') out.sort((a, b) => b.createdAt - a.createdAt)
  return out
}

export function createThread(input: { title: string; categoryId?: string }): Thread {
  const thread: Thread = {
    id: `t${nextThreadId++}`,
    title: input.title,
    categoryId: input.categoryId ?? 'g1',
    votes: 0,
    createdAt: nextCreatedAt++,
  }
  threads.push(thread)
  return thread
}

export function findThread(id: string): Thread | undefined {
  return threads.find((t) => t.id === id)
}

export function upvoteThread(id: string): Thread | undefined {
  const thread = threads.find((t) => t.id === id)
  if (!thread) return undefined
  thread.votes += 1
  return thread
}

export function deleteThread(id: string): boolean {
  const idx = threads.findIndex((t) => t.id === id)
  if (idx === -1) return false
  threads.splice(idx, 1)
  return true
}

export function listReplies(threadId: string): Reply[] {
  return replies.filter((r) => r.threadId === threadId)
}

export function createReply(input: { threadId: string; text: string }): Reply {
  const reply: Reply = {
    id: `r${nextReplyId++}`,
    threadId: input.threadId,
    text: input.text,
    votes: 0,
  }
  replies.push(reply)
  return reply
}
