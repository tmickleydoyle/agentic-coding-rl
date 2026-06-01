export type Note = {
  id: string
  title: string
  body: string
  tags: string[]
}

export type Route = 'list' | 'editor' | 'tags' | 'settings'
export type Theme = 'light' | 'dark'
