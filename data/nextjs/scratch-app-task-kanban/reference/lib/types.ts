export type Column = 'backlog' | 'doing' | 'done'

export type Card = {
  id: string
  title: string
  column: Column
  archived: boolean
}

export type Route = 'board' | 'add-card' | 'archive' | 'settings'
export type Theme = 'light' | 'dark'

export const COLUMNS: Column[] = ['backlog', 'doing', 'done']
