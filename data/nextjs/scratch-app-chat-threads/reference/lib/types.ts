export type Member = {
  id: string
  name: string
  handle: string
}

export type Reply = {
  id: string
  messageId: string
  authorId: string
  text: string
}

export type Message = {
  id: string
  authorId: string
  text: string
  resolved: boolean
}

export type Route = 'channel' | 'thread' | 'search' | 'settings'
export type Theme = 'light' | 'dark'
