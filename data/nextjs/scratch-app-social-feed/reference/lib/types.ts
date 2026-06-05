export type User = {
  id: string
  name: string
  handle: string
}

export type Comment = {
  id: string
  postId: string
  authorId: string
  text: string
}

export type Post = {
  id: string
  authorId: string
  text: string
  likes: number
  likedByMe: boolean
}

export type FeedFilter = 'all' | 'following'

export type Route = 'feed' | 'post' | 'profile' | 'explore'
export type Theme = 'light' | 'dark'
