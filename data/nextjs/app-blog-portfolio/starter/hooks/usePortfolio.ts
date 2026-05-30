'use client'
import { useApp } from '../components/AppStateProvider'
import type { Project } from '../lib/types'

export function collectTags(_projects: Project[]): string[] {
  // TODO: return the sorted unique set of every tag across projects
  return []
}

export function filterByTag(_projects: Project[], _tag: string): Project[] {
  // TODO: 'all' => all; otherwise projects whose tags include the filter
  return []
}

export function usePortfolio() {
  const { projects, tagFilter } = useApp()
  const featuredProjects = projects.filter((p) => p.featured)
  const allTags = collectTags(projects)
  const visibleProjects = filterByTag(projects, tagFilter)
  return { featuredProjects, allTags, visibleProjects }
}
