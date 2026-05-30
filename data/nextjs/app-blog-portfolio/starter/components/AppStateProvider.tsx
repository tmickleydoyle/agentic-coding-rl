'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Post, Project, Route, Theme } from '../lib/types'

type NewProjectInput = {
  title: string
  tags: string[]
}

type AppApi = {
  projects: Project[]
  posts: Post[]
  theme: Theme
  route: Route
  currentProjectId: string | null
  tagFilter: string
  addProject: (input: NewProjectInput) => void
  toggleFeatured: (id: string) => void
  selectProject: (id: string) => void
  setTagFilter: (tag: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  projects: [],
  posts: [],
  theme: 'light',
  route: 'home',
  currentProjectId: null,
  tagFilter: 'all',
  addProject: () => {},
  toggleFeatured: () => {},
  selectProject: () => {},
  setTagFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold projects/posts/theme/route/currentProjectId/tagFilter in state (seed 3
  // projects + 3 posts), implement the actions, and provide them through AppContext.
  // The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
