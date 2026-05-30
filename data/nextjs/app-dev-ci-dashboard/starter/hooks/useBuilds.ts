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

export function countBuilds(_builds: Build[], _pipelines: Pipeline[]): BuildCounts {
  // TODO: compute total/passing/failing/running and per-pipeline counts
  return { total: 0, passing: 0, failing: 0, running: 0, byPipeline: {} }
}

export function filterBuilds(_builds: Build[], _statusFilter: StatusFilter): Build[] {
  // TODO: apply the status filter ('all' returns everything)
  return []
}

export function successRate(_builds: Build[]): number {
  // TODO: passing / (passing + failing) as a 0-100 integer; 0 when no finished builds
  return 0
}

export function useBuilds() {
  const { builds, pipelines, statusFilter } = useApp()
  const counts = countBuilds(builds, pipelines)
  const filtered = filterBuilds(builds, statusFilter)
  const rate = successRate(builds)
  return { counts, filtered, successRate: rate }
}
