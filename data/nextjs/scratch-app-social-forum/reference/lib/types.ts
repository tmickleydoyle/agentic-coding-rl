export type Category = {
  id: string
  name: string
}

export type Reply = {
  id: string
  threadId: string
  text: string
  votes: number
}

export type Thread = {
  id: string
  title: string
  categoryId: string
  votes: number
  createdAt: number
}

export type Sort = 'votes' | 'recent'
export type CategoryFilter = 'all' | string

export type Route = 'threads' | 'thread' | 'new' | 'categories'
export type Theme = 'light' | 'dark'
