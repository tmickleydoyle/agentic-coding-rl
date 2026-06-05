import type { Comment, Post, User } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let users: User[] = []
let posts: Post[] = []
let comments: Comment[] = []
let nextPostId = 1
let nextCommentId = 1

function seed(): void {
  users = [
    { id: 'u1', name: 'You', handle: '@you' },
    { id: 'u2', name: 'Ada', handle: '@ada' },
    { id: 'u3', name: 'Linus', handle: '@linus' },
  ]
  posts = [
    { id: 'p1', authorId: 'u2', text: 'Hello world', likes: 3, likedByMe: false },
    { id: 'p2', authorId: 'u3', text: 'Shipped a feature', likes: 1, likedByMe: true },
    { id: 'p3', authorId: 'u1', text: 'Coffee then code', likes: 0, likedByMe: false },
  ]
  comments = [
    { id: 'c1', postId: 'p1', authorId: 'u3', text: 'Nice!' },
    { id: 'c2', postId: 'p1', authorId: 'u1', text: 'Welcome' },
    { id: 'c3', postId: 'p2', authorId: 'u2', text: 'Congrats' },
  ]
  nextPostId = 4
  nextCommentId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listUsers(): User[] {
  return users.slice()
}

export function listPosts(filter?: { authorId?: string | null }): Post[] {
  let out = posts.slice()
  const authorId = filter?.authorId
  if (authorId) out = out.filter((p) => p.authorId === authorId)
  return out
}

export function createPost(input: { authorId: string; text: string }): Post {
  const post: Post = {
    id: `p${nextPostId++}`,
    authorId: input.authorId,
    text: input.text,
    likes: 0,
    likedByMe: false,
  }
  posts.push(post)
  return post
}

export function findPost(id: string): Post | undefined {
  return posts.find((p) => p.id === id)
}

export function setLiked(id: string, liked?: boolean): Post | undefined {
  const post = posts.find((p) => p.id === id)
  if (!post) return undefined
  const next = typeof liked === 'boolean' ? liked : !post.likedByMe
  if (next !== post.likedByMe) {
    post.likedByMe = next
    post.likes += next ? 1 : -1
  }
  return post
}

export function deletePost(id: string): boolean {
  const idx = posts.findIndex((p) => p.id === id)
  if (idx === -1) return false
  posts.splice(idx, 1)
  return true
}

export function listComments(postId: string): Comment[] {
  return comments.filter((c) => c.postId === postId)
}

export function createComment(input: { postId: string; authorId: string; text: string }): Comment {
  const comment: Comment = {
    id: `c${nextCommentId++}`,
    postId: input.postId,
    authorId: input.authorId,
    text: input.text,
  }
  comments.push(comment)
  return comment
}
