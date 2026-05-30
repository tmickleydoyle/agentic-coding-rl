export type Notebook = {
  id: string
  name: string
}

export type Note = {
  id: string
  notebookId: string
  title: string
  body: string
  tags: string[]
  pinned: boolean
}

export type Route = 'notebooks' | 'notes' | 'editor' | 'search'
export type Theme = 'light' | 'dark'
