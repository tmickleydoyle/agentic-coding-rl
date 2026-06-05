'use client'
import { useApp } from '../components/AppStateProvider'
import { AGENTS } from '../lib/types'
import type { Session, SessionStatus } from '../lib/types'

export function byStatus(sessions: Session[], status: SessionStatus): Session[] {
  return sessions.filter((s) => s.status === status)
}

export function activeCountByAgent(sessions: Session[]): Record<string, number> {
  const counts: Record<string, number> = {}
  AGENTS.forEach((a) => {
    counts[a] = 0
  })
  sessions.forEach((s) => {
    if (s.status === 'active' && s.agent) {
      counts[s.agent] = (counts[s.agent] ?? 0) + 1
    }
  })
  return counts
}

export function useSessions() {
  const { sessions } = useApp()
  const waiting = byStatus(sessions, 'waiting')
  const active = byStatus(sessions, 'active')
  const closed = byStatus(sessions, 'closed')
  const agentLoad = activeCountByAgent(sessions)
  return { waiting, active, closed, agentLoad, agents: AGENTS }
}
