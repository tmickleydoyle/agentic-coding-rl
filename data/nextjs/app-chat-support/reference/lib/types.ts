export type Agent = {
  id: string
  name: string
}

export type Canned = {
  id: string
  label: string
  text: string
}

export type Reply = {
  id: string
  chatId: string
  authorId: string
  text: string
}

export type Status = 'open' | 'closed'

export type Chat = {
  id: string
  customer: string
  status: Status
  agentId: string | null
}

export type Route = 'queue' | 'chat' | 'canned' | 'history'
export type Theme = 'light' | 'dark'
