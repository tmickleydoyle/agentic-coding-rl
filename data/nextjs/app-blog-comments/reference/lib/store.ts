import type { Comment, Post } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.
// Tests call __reset() in beforeEach for isolation.

let posts: Post[] = []
let comments: Comment[] = []
let nextCommentId = 1

function seed(): void {
  posts = [
    { id: 'p1', title: 'Getting Started' },
    { id: 'p2', title: 'Advanced Tips' },
  ]
  comments = [
    { id: 'k1', postId: 'p1', author: 'Ada', body: 'Great post!', status: 'approved' },
    { id: 'k2', postId: 'p1', author: 'Spammer', body: 'buy now', status: 'pending' },
    { id: 'k3', postId: 'p2', author: 'Lin', body: 'Thanks', status: 'pending' },
    { id: 'k4', postId: 'p2', author: 'Bot', body: 'cheap pills', status: 'spam' },
  ]
  nextCommentId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listComments(filter?: { status?: string | null; postId?: string | null }): Comment[] {
  let out = comments.slice()
  const status = filter?.status
  if (status === 'pending' || status === 'approved' || status === 'spam') {
    out = out.filter((c) => c.status === status)
  }
  const postId = filter?.postId
  if (postId) out = out.filter((c) => c.postId === postId)
  return out
}

export function createComment(input: { postId: string; author: string; body?: string }): Comment {
  const comment: Comment = {
    id: `k${nextCommentId++}`,
    postId: input.postId,
    author: input.author,
    body: input.body ?? '',
    status: 'pending',
  }
  comments.push(comment)
  return comment
}

export function findComment(id: string): Comment | undefined {
  return comments.find((c) => c.id === id)
}

export function updateComment(id: string, patch: { status?: string }): Comment | undefined {
  const comment = comments.find((c) => c.id === id)
  if (!comment) return undefined
  if (patch.status === 'pending' || patch.status === 'approved' || patch.status === 'spam') {
    comment.status = patch.status
  }
  return comment
}

export function deleteComment(id: string): boolean {
  const idx = comments.findIndex((c) => c.id === id)
  if (idx === -1) return false
  comments.splice(idx, 1)
  return true
}

export function listPosts(): Post[] {
  return posts.slice()
}
