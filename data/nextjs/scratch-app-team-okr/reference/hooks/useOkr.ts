'use client'
import { useApp } from '../components/AppStateProvider'
import { companyProgress, objectiveProgress } from '../lib/progress'
import type { Objective } from '../lib/types'

export function progressOf(objective: Objective): number {
  return objectiveProgress(objective)
}

export function useOkr() {
  const { objectives } = useApp()
  return { company: companyProgress(objectives), progressOf }
}
