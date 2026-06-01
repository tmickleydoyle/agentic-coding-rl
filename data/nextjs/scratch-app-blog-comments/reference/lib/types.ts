export type CommentStatus = 'pending' | 'approved' | 'spam'

export type Post = {
  id: string
  title: string
}

export type Comment = {
  id: string
  postId: string
  author: string
  body: string
  status: CommentStatus
}

export type StatusFilter = 'all' | CommentStatus

export type Route = 'posts' | 'post-detail' | 'moderation' | 'settings'
export type Theme = 'light' | 'dark'
