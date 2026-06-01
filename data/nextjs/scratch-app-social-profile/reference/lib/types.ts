export type Profile = {
  id: string
  name: string
  bio: string
}

export type Post = {
  id: string
  authorId: string
  text: string
}

export type Route = 'profile' | 'posts' | 'connections' | 'edit'
export type Theme = 'light' | 'dark'
