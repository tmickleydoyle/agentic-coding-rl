'use client'
import { useApp } from '../components/AppStateProvider'
import type { Session } from '../lib/types'

export function findConflict(
  sessions: Session[],
  agendaIds: string[],
  id: string,
): string | null {
  const target = sessions.find((s) => s.id === id)
  if (!target) return null
  let found: string | null = null
  agendaIds.forEach((aid) => {
    if (found) return
    if (aid === id) return
    const other = sessions.find((s) => s.id === aid)
    if (other && other.slot === target.slot) found = aid
  })
  return found
}

export function useAgenda() {
  const { sessions, agenda } = useApp()

  const agendaSessions: Session[] = agenda
    .map((id) => sessions.find((s) => s.id === id))
    .filter((s): s is Session => Boolean(s))

  const sessionsByTrack: Record<string, Session[]> = {}
  sessions.forEach((s) => {
    if (!sessionsByTrack[s.track]) sessionsByTrack[s.track] = []
    sessionsByTrack[s.track].push(s)
  })

  const agendaCount = agendaSessions.length

  return { agendaSessions, sessionsByTrack, agendaCount }
}
