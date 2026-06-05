'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PROJECTS: Project[] = [
  { id: 'j1', title: 'Portfolio site', tags: ['web', 'ts'], featured: true },
  { id: 'j2', title: 'Data pipeline', tags: ['python'], featured: false },
  { id: 'j3', title: 'Game engine', tags: ['cpp', 'web'], featured: false },
]

const SEED_POSTS: Post[] = [
  { id: 'w1', title: 'Why I left Vim', tag: 'web' },
  { id: 'w2', title: 'Typing tricks', tag: 'ts' },
  { id: 'w3', title: 'On profiling', tag: 'python' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS)
  const [posts] = useState<Post[]>(SEED_POSTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('home')
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addProject = (input: NewProjectInput) => {
      const id = `j${nextId}`
      setNextId((n) => n + 1)
      setProjects((prev) => [
        ...prev,
        { id, title: input.title, tags: input.tags, featured: false },
      ])
    }

    const toggleFeatured = (id: string) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
      )
    }

    const selectProject = (id: string) => setCurrentProjectId(id)
    const navigate = (next: Route) => setRoute(next)

    return {
      projects,
      posts,
      theme,
      route,
      currentProjectId,
      tagFilter,
      addProject,
      toggleFeatured,
      selectProject,
      setTagFilter,
      setTheme,
      navigate,
    }
  }, [projects, posts, theme, route, currentProjectId, tagFilter, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
