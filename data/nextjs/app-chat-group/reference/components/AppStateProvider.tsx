'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Group, Person, Route, Theme } from '../lib/types'

type AppApi = {
  people: Person[]
  groups: Group[]
  theme: Theme
  route: Route
  currentUserId: string
  selectedGroupId: string | null
  openGroup: (groupId: string) => void
  addMember: (groupId: string, personId: string) => void
  removeMember: (groupId: string, personId: string) => void
  leaveGroup: (groupId: string) => void
  createGroup: (name: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_PEOPLE: Person[] = [
  { id: 'u1', name: 'You' },
  { id: 'u2', name: 'Ada' },
  { id: 'u3', name: 'Linus' },
  { id: 'u4', name: 'Grace' },
]

const SEED_GROUPS: Group[] = [
  { id: 'g1', name: 'Weekend Plans', adminId: 'u1', memberIds: ['u1', 'u2', 'u3'] },
  { id: 'g2', name: 'Book Club', adminId: 'u2', memberIds: ['u1', 'u2', 'u4'] },
  { id: 'g3', name: 'Founders', adminId: 'u3', memberIds: ['u3', 'u4'] },
]

const CURRENT_USER_ID = 'u1'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [people] = useState<Person[]>(SEED_PEOPLE)
  const [groups, setGroups] = useState<Group[]>(SEED_GROUPS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('chats')
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [nextGroupId, setNextGroupId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const openGroup = (groupId: string) => {
      setSelectedGroupId(groupId)
      setRoute('chat-detail')
    }

    const addMember = (groupId: string, personId: string) => {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId && !g.memberIds.includes(personId)
            ? { ...g, memberIds: [...g.memberIds, personId] }
            : g,
        ),
      )
    }

    const removeMember = (groupId: string, personId: string) => {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId && personId !== g.adminId
            ? { ...g, memberIds: g.memberIds.filter((m) => m !== personId) }
            : g,
        ),
      )
    }

    const leaveGroup = (groupId: string) => {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId && CURRENT_USER_ID !== g.adminId
            ? { ...g, memberIds: g.memberIds.filter((m) => m !== CURRENT_USER_ID) }
            : g,
        ),
      )
    }

    const createGroup = (name: string) => {
      const trimmed = name.trim()
      if (trimmed.length === 0) return
      const id = `g${nextGroupId}`
      setNextGroupId((n) => n + 1)
      setGroups((prev) => [
        ...prev,
        { id, name: trimmed, adminId: CURRENT_USER_ID, memberIds: [CURRENT_USER_ID] },
      ])
      setSelectedGroupId(id)
      setRoute('chat-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      people,
      groups,
      theme,
      route,
      currentUserId: CURRENT_USER_ID,
      selectedGroupId,
      openGroup,
      addMember,
      removeMember,
      leaveGroup,
      createGroup,
      setTheme,
      navigate,
    }
  }, [people, groups, theme, route, selectedGroupId, nextGroupId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
