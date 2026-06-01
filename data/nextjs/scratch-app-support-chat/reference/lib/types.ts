export type SessionStatus = 'waiting' | 'active' | 'closed'

export type Message = {
  id: string
  from: 'visitor' | 'agent'
  text: string
}

export type Session = {
  id: string
  visitor: string
  topic: string
  status: SessionStatus
  agent: string | null
  messages: Message[]
}

export type Route = 'queue' | 'session' | 'history' | 'agents'
export type Theme = 'light' | 'dark'

export const AGENTS: string[] = ['alice', 'bob', 'carol']
