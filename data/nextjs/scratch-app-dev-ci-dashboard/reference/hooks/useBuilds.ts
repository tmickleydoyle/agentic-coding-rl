'use client'
import { useApp } from '../components/AppStateProvider'
import type { Build, Pipeline, StatusFilter } from '../lib/types'

export type BuildCounts = {
  total: number
  passing: number
  failing: number
  running: number
  byPipeline: Record<string, number>
}

export function countBuilds(builds: Build[], pipelines: Pipeline[]): BuildCounts {
  const byPipeline: Record<string, number> = {}
  pipelines.forEach((p) => {
    byPipeline[p.id] = 0
  })
  let passing = 0
  let failing = 0
  let running = 0
  builds.forEach((b) => {
    if (b.status === 'passing') passing += 1
    else if (b.status === 'failing') failing += 1
    else running += 1
    byPipeline[b.pipelineId] = (byPipeline[b.pipelineId] ?? 0) + 1
  })
  return {
    total: builds.length,
    passing,
    failing,
    running,
    byPipeline,
  }
}

export function filterBuilds(builds: Build[], statusFilter: StatusFilter): Build[] {
  if (statusFilter === 'all') return builds.slice()
  return builds.filter((b) => b.status === statusFilter)
}

export function successRate(builds: Build[]): number {
  let passing = 0
  let finished = 0
  builds.forEach((b) => {
    if (b.status === 'passing') {
      passing += 1
      finished += 1
    } else if (b.status === 'failing') {
      finished += 1
    }
  })
  if (finished === 0) return 0
  return Math.round((passing / finished) * 100)
}

export function useBuilds() {
  const { builds, pipelines, statusFilter } = useApp()
  const counts = countBuilds(builds, pipelines)
  const filtered = filterBuilds(builds, statusFilter)
  const rate = successRate(builds)
  return { counts, filtered, successRate: rate }
}
