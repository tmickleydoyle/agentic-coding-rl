'use client'
import { useApp } from '../components/AppStateProvider'
import { AGENTS } from '../lib/types'
import type { Session, SessionStatus } from '../lib/types'

export function byStatus(_sessions: Session[], _status: SessionStatus): Session[] {
  // TODO: return sessions with the given status
  return []
}

export function activeCountByAgent(_sessions: Session[]): Record<string, number> {
  // TODO: count active sessions per agent (seeded from AGENTS)
  return {}
}

export function useSessions() {
  const { sessions } = useApp()
  void sessions
  return {
    waiting: [] as Session[],
    active: [] as Session[],
    closed: [] as Session[],
    agentLoad: {} as Record<string, number>,
    agents: AGENTS,
  }
}
