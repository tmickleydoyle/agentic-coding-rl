'use client'
import { useApp } from '../components/AppStateProvider'
import type { Deal, Stage } from '../lib/types'

export const STAGES: Stage[] = ['lead', 'qualified', 'proposal', 'won', 'lost']

export function dealsForStage(_deals: Deal[], _stage: Stage): Deal[] {
  // TODO: filter deals by stage
  return []
}

export function stageTotals(_deals: Deal[]): Array<{ stage: Stage; count: number; value: number }> {
  // TODO: per-stage count and summed value
  return []
}

export function winRate(_deals: Deal[]): number {
  // TODO: won / (won + lost) as a rounded percent; 0 if none closed
  return 0
}

export function openValue(_deals: Deal[]): number {
  // TODO: sum of values for non-won/non-lost deals
  return 0
}

export function usePipeline() {
  const { deals } = useApp()
  return {
    totals: stageTotals(deals),
    winRate: winRate(deals),
    openValue: openValue(deals),
  }
}
