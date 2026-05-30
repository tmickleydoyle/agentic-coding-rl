export type Snippet = {
  id: string
  title: string
  language: string
  code: string
  favorite: boolean
  copyCount: number
}

export type Route = 'snippets' | 'detail' | 'add' | 'favorites'
export type Theme = 'light' | 'dark'
