'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { DateRange, PageStat, Route, Source, Theme } from '../lib/types'

type AppApi = {
  pages: PageStat[]
  sources: Source[]
  theme: Theme
  route: Route
  range: DateRange
  selectedPageId: string | null
  setRange: (range: DateRange) => void
  selectPage: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_PAGES: PageStat[] = [
  { id: 'pg1', path: '/', views: 1000, sessions: 800, bounceRate: 40, range7d: 200, range30d: 600 },
  { id: 'pg2', path: '/blog', views: 600, sessions: 500, bounceRate: 55, range7d: 150, range30d: 400 },
  { id: 'pg3', path: '/about', views: 300, sessions: 250, bounceRate: 70, range7d: 50, range30d: 120 },
  { id: 'pg4', path: '/pricing', views: 400, sessions: 380, bounceRate: 35, range7d: 120, range30d: 300 },
]

const SEED_SOURCES: Source[] = [
  { id: 's1', name: 'Google', sessions: 900, conversions: 90 },
  { id: 's2', name: 'Direct', sessions: 600, conversions: 30 },
  { id: 's3', name: 'Referral', sessions: 230, conversions: 46 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [pages] = useState<PageStat[]>(SEED_PAGES)
  const [sources] = useState<Source[]>(SEED_SOURCES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('overview')
  const [range, setRange] = useState<DateRange>('all')
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const selectPage = (id: string) => {
      setSelectedPageId(id)
      setRoute('pages')
    }
    const navigate = (next: Route) => setRoute(next)
    return {
      pages,
      sources,
      theme,
      route,
      range,
      selectedPageId,
      setRange,
      selectPage,
      setTheme,
      navigate,
    }
  }, [pages, sources, theme, route, range, selectedPageId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
