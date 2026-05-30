'use client'
import { useApp } from '../components/AppStateProvider'
import type { Deal, Stage } from '../lib/types'

export const STAGES: Stage[] = ['lead', 'qualified', 'proposal', 'won', 'lost']

export function dealsForStage(deals: Deal[], stage: Stage): Deal[] {
  return deals.filter((d) => d.stage === stage)
}

export function stageTotals(deals: Deal[]): Array<{ stage: Stage; count: number; value: number }> {
  return STAGES.map((stage) => {
    const inStage = deals.filter((d) => d.stage === stage)
    return {
      stage,
      count: inStage.length,
      value: inStage.reduce((sum, d) => sum + d.value, 0),
    }
  })
}

export function winRate(deals: Deal[]): number {
  const won = deals.filter((d) => d.stage === 'won').length
  const lost = deals.filter((d) => d.stage === 'lost').length
  const closed = won + lost
  if (closed === 0) return 0
  return Math.round((won / closed) * 100)
}

export function openValue(deals: Deal[]): number {
  return deals
    .filter((d) => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + d.value, 0)
}

export function usePipeline() {
  const { deals } = useApp()
  return {
    totals: stageTotals(deals),
    winRate: winRate(deals),
    openValue: openValue(deals),
  }
}
