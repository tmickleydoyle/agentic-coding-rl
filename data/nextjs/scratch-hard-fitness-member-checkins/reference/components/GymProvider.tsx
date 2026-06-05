'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Member, CheckIn } from '../lib/types'

type Ctx = {
  members: Member[]
  checkins: CheckIn[]
  theme: 'light' | 'dark'
  hideMet: boolean
  route: Route
  navigate: (r: Route) => void
  addMember: (name: string, goal: string) => void
  checkIn: (memberId: string) => void
  toggleTheme: () => void
  toggleHideMet: () => void
}

export const GymContext = createContext<Ctx | null>(null)

export function GymProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([])
  const [checkins, setCheckins] = useState<CheckIn[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideMet, setHideMet] = useState(false)
  const [route, setRoute] = useState<Route>('members')
  const [nextMemberId, setNextMemberId] = useState(1)
  const [nextCheckId, setNextCheckId] = useState(1)

  function addMember(name: string, goal: string) {
    const g = parseInt(goal, 10)
    const trimmed = name.trim()
    if (!trimmed || !isFinite(g) || g <= 0) return
    setMembers((m) => [...m, { id: nextMemberId, name: trimmed, goal: g }])
    setNextMemberId((n) => n + 1)
  }

  function checkIn(memberId: string) {
    const mid = parseInt(memberId, 10)
    if (!members.some((m) => m.id === mid)) return
    setCheckins((c) => [...c, { id: nextCheckId, memberId: mid }])
    setNextCheckId((n) => n + 1)
  }

  const value: Ctx = {
    members,
    checkins,
    theme,
    hideMet,
    route,
    navigate: setRoute,
    addMember,
    checkIn,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideMet: () => setHideMet((s) => !s),
  }
  return <GymContext.Provider value={value}>{children}</GymContext.Provider>
}
