'use client'
import { useApp } from '../components/AppStateProvider'
import type { Project } from '../lib/types'

export function collectTags(projects: Project[]): string[] {
  const set: Record<string, true> = {}
  projects.forEach((p) => {
    p.tags.forEach((t) => {
      set[t] = true
    })
  })
  return Object.keys(set).sort()
}

export function filterByTag(projects: Project[], tag: string): Project[] {
  if (tag === 'all') return projects.slice()
  return projects.filter((p) => p.tags.includes(tag))
}

export function usePortfolio() {
  const { projects, tagFilter } = useApp()
  const featuredProjects = projects.filter((p) => p.featured)
  const allTags = collectTags(projects)
  const visibleProjects = filterByTag(projects, tagFilter)
  return { featuredProjects, allTags, visibleProjects }
}
