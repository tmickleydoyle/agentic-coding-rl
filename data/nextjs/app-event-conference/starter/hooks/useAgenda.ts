'use client'
import { useApp } from '../components/AppStateProvider'
import type { Session } from '../lib/types'

export function useAgenda() {
  // TODO: derive agendaSessions (Session[] in agenda order), sessionsByTrack (track ->
  // Session[]), and agendaCount from the shared sessions/agenda state.
  useApp()
  const agendaSessions: Session[] = []
  const sessionsByTrack: Record<string, Session[]> = {}
  const agendaCount = 0
  return { agendaSessions, sessionsByTrack, agendaCount }
}
