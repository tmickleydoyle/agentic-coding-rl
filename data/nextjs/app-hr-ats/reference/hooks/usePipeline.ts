'use client'
import { useApp } from '../components/AppStateProvider'
import type { Candidate, Stage } from '../lib/types'
import { STAGES } from '../lib/types'

export function candidatesForJob(candidates: Candidate[], jobId: string): Candidate[] {
  return candidates.filter((c) => c.jobId === jobId)
}

export function countByStage(candidates: Candidate[]): Record<Stage, number> {
  const counts: Record<Stage, number> = {
    applied: 0,
    screen: 0,
    interview: 0,
    offer: 0,
    hired: 0,
  }
  candidates.forEach((c) => {
    counts[c.stage] = (counts[c.stage] ?? 0) + 1
  })
  return counts
}

export function candidatesByStage(candidates: Candidate[]): Record<Stage, Candidate[]> {
  const out: Record<Stage, Candidate[]> = {
    applied: [],
    screen: [],
    interview: [],
    offer: [],
    hired: [],
  }
  candidates.forEach((c) => {
    out[c.stage].push(c)
  })
  return out
}

export function nextStage(stage: Stage): Stage {
  const idx = STAGES.indexOf(stage)
  return idx >= 0 && idx < STAGES.length - 1 ? STAGES[idx + 1] : stage
}

export function usePipeline() {
  const { candidates } = useApp()
  return {
    counts: countByStage(candidates),
    byStage: candidatesByStage(candidates),
  }
}
