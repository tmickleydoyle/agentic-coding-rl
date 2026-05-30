export type Clip = {
  id: string
  title: string
  category: string
  likes: number
}

export type Route = 'feed' | 'clip-detail' | 'saved' | 'categories'
export type Theme = 'light' | 'dark'
