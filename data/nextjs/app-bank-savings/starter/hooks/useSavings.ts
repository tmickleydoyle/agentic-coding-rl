'use client'
import { useSavings } from '../components/SavingsProvider'
import type { Pot } from '../lib/types'

export type SavingsTotals = {
  totalSaved: number
  totalGoal: number
  potCount: number
  metCount: number
  unallocated: number
}

export function potProgress(_pot: Pot): number {
  return 0 // TODO: round(balance/goal*100), capped at 100; 100 when goal is 0
}
export function potMet(_pot: Pot): boolean {
  return false // TODO: balance >= goal
}
export function savingsTotals(_pots: Pot[], _unallocated: number): SavingsTotals {
  // TODO: sum balances/goals, count met pots
  return { totalSaved: 0, totalGoal: 0, potCount: 0, metCount: 0, unallocated: 0 }
}
export function useSavingsSummary() {
  useSavings() // TODO: derive totals from context (pots + unallocated)
  return { totals: { totalSaved: 0, totalGoal: 0, potCount: 0, metCount: 0, unallocated: 0 } as SavingsTotals }
}
