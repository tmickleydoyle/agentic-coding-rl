'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { clampRollout, type AuditEntry, type Env, type Flag, type Route, type Theme } from '../lib/types'

type NewFlagInput = {
  key: string
  description?: string
}

type AppApi = {
  flags: Flag[]
  audit: AuditEntry[]
  theme: Theme
  route: Route
  selectedId: string | null
  selectFlag: (id: string) => void
  toggleEnv: (id: string, env: Env) => void
  setRollout: (id: string, pct: number) => void
  addFlag: (input: NewFlagInput) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

function seedFlags(): Flag[] {
  return [
    {
      id: 'f1',
      key: 'new-checkout',
      description: 'New checkout flow',
      envs: { dev: true, stage: true, prod: false },
      rollout: 50,
    },
    {
      id: 'f2',
      key: 'dark-mode',
      description: 'Dark mode',
      envs: { dev: true, stage: false, prod: false },
      rollout: 25,
    },
    {
      id: 'f3',
      key: 'beta-search',
      description: 'Beta search',
      envs: { dev: false, stage: false, prod: false },
      rollout: 0,
    },
  ]
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Flag[]>(seedFlags)
  const [audit, setAudit] = useState<AuditEntry[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('flags')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextFlagId, setNextFlagId] = useState(4)
  const [nextAuditId, setNextAuditId] = useState(1)
  const [nextCreatedAt, setNextCreatedAt] = useState(1)

  const value = useMemo<AppApi>(() => {
    const appendAudit = (flagId: string, action: string, env: Env | null) => {
      const id = `a${nextAuditId}`
      const createdAt = nextCreatedAt
      setNextAuditId((n) => n + 1)
      setNextCreatedAt((n) => n + 1)
      setAudit((prev) => [...prev, { id, flagId, action, env, createdAt }])
    }

    const selectFlag = (id: string) => {
      setSelectedId(id)
      setRoute('flag-detail')
    }

    const toggleEnv = (id: string, env: Env) => {
      setFlags((prev) =>
        prev.map((f) => (f.id === id ? { ...f, envs: { ...f.envs, [env]: !f.envs[env] } } : f)),
      )
      appendAudit(id, 'toggle', env)
    }

    const setRollout = (id: string, pct: number) => {
      const clamped = clampRollout(pct)
      setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, rollout: clamped } : f)))
      appendAudit(id, 'rollout', null)
    }

    const addFlag = (input: NewFlagInput) => {
      const id = `f${nextFlagId}`
      setNextFlagId((n) => n + 1)
      setFlags((prev) => [
        ...prev,
        {
          id,
          key: input.key,
          description: input.description ?? '',
          envs: { dev: false, stage: false, prod: false },
          rollout: 0,
        },
      ])
      appendAudit(id, 'create', null)
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      flags,
      audit,
      theme,
      route,
      selectedId,
      selectFlag,
      toggleEnv,
      setRollout,
      addFlag,
      setTheme,
      navigate,
    }
  }, [flags, audit, theme, route, selectedId, nextFlagId, nextAuditId, nextCreatedAt])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useFlags(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useFlags must be used within an AppStateProvider')
  return v
}
