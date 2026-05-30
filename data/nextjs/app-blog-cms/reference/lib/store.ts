import type { Category, Post } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// AppStateProvider state — its own seed data and lifecycle. Tests call __reset()
// in beforeEach so each test starts from the same seed.

let posts: Post[] = []
let categories: Category[] = []
let nextPostId = 1
let nextCategoryId = 1

function seed(): void {
  categories = [
    { id: 'c1', name: 'Engineering' },
    { id: 'c2', name: 'Design' },
    { id: 'c3', name: 'Company' },
  ]
  posts = [
    { id: 'b1', title: 'Hello World', body: 'First post', categoryId: 'c1', status: 'published' },
    { id: 'b2', title: 'Design Systems', body: 'On tokens', categoryId: 'c2', status: 'draft' },
    { id: 'b3', title: 'We are hiring', body: 'Join us', categoryId: 'c3', status: 'published' },
  ]
  nextPostId = 4
  nextCategoryId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listPosts(filter?: { status?: string | null; categoryId?: string | null }): Post[] {
  let out = posts.slice()
  const status = filter?.status
  if (status === 'draft') out = out.filter((p) => p.status === 'draft')
  else if (status === 'published') out = out.filter((p) => p.status === 'published')
  const categoryId = filter?.categoryId
  if (categoryId) out = out.filter((p) => p.categoryId === categoryId)
  return out
}

export function createPost(input: {
  title: string
  body?: string
  categoryId?: string
  status?: string
}): Post {
  const status: Post['status'] = input.status === 'published' ? 'published' : 'draft'
  const post: Post = {
    id: `b${nextPostId++}`,
    title: input.title,
    body: input.body ?? '',
    categoryId: input.categoryId ?? 'c1',
    status,
  }
  posts.push(post)
  return post
}

export function findPost(id: string): Post | undefined {
  return posts.find((p) => p.id === id)
}

export function updatePost(
  id: string,
  patch: { title?: string; body?: string; categoryId?: string; status?: string },
): Post | undefined {
  const post = posts.find((p) => p.id === id)
  if (!post) return undefined
  if (typeof patch.title === 'string') post.title = patch.title
  if (typeof patch.body === 'string') post.body = patch.body
  if (typeof patch.categoryId === 'string') post.categoryId = patch.categoryId
  if (patch.status === 'draft' || patch.status === 'published') post.status = patch.status
  return post
}

export function deletePost(id: string): boolean {
  const idx = posts.findIndex((p) => p.id === id)
  if (idx === -1) return false
  posts.splice(idx, 1)
  return true
}

export function listCategories(): Category[] {
  return categories.slice()
}

export function createCategory(input: { name: string }): Category {
  const category: Category = { id: `c${nextCategoryId++}`, name: input.name }
  categories.push(category)
  return category
}
