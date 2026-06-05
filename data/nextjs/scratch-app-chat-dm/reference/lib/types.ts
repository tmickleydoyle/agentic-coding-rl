export type Person = {
  id: string
  name: string
  handle: string
}

export type DM = {
  id: string
  threadId: string
  authorId: string
  text: string
}

export type Thread = {
  id: string
  personId: string
  unread: boolean
}

export type Route = 'inbox' | 'thread' | 'people' | 'settings'
export type Theme = 'light' | 'dark'
