export type Member = {
  id: string
  name: string
}

export type Entry = {
  id: string
  memberId: string
  date: string
  yesterday: string
  today: string
  blocker: string | null
}

export type Route = 'today' | 'history' | 'team' | 'add-entry'
export type Theme = 'light' | 'dark'

export const TODAY = '2026-05-29'
