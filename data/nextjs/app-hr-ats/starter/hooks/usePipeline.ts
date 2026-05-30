'use client'
import { useApp } from '../components/AppStateProvider'
import type { Candidate, Stage } from '../lib/types'

export function candidatesForJob(_candidates: Candidate[], _jobId: string): Candidate[] {
  // TODO: filter candidates by jobId
  return []
}

export function countByStage(_candidates: Candidate[]): Record<Stage, number> {
  // TODO: count candidates per stage
  return { applied: 0, screen: 0, interview: 0, offer: 0, hired: 0 }
}

export function candidatesByStage(_candidates: Candidate[]): Record<Stage, Candidate[]> {
  // TODO: split candidates into per-stage buckets
  return { applied: [], screen: [], interview: [], offer: [], hired: [] }
}

export function nextStage(stage: Stage): Stage {
  // TODO: return the following stage (or the same when already 'hired')
  return stage
}

export function usePipeline() {
  const { candidates } = useApp()
  return {
    counts: countByStage(candidates),
    byStage: candidatesByStage(candidates),
  }
}
