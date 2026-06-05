export type PostStatus = 'draft' | 'published'

export type Post = {
  id: string
  title: string
  body: string
  categoryId: string
  status: PostStatus
}

export type Category = {
  id: string
  name: string
}

export type StatusFilter = 'all' | PostStatus
export type CategoryFilter = 'all' | string

export type Route = 'posts' | 'editor' | 'categories' | 'published'
export type Theme = 'light' | 'dark'
