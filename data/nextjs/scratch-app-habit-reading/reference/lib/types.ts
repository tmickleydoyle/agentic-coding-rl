export type ReadLog = {
  id: string
  date: string
  pages: number
}

export type Book = {
  id: string
  title: string
  done: boolean
}

export type Route = 'today' | 'books' | 'log' | 'stats'
export type Theme = 'light' | 'dark'

export const TODAY = '2026-05-28'
