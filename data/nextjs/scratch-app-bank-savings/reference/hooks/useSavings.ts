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

export function potProgress(pot: Pot): number {
  if (pot.goal === 0) return 100
  const pct = Math.round((pot.balance / pot.goal) * 100)
  return Math.min(100, pct)
}

export function potMet(pot: Pot): boolean {
  return pot.balance >= pot.goal
}

export function savingsTotals(pots: Pot[], unallocated: number): SavingsTotals {
  let totalSaved = 0
  let totalGoal = 0
  let metCount = 0
  pots.forEach((p) => {
    totalSaved += p.balance
    totalGoal += p.goal
    if (potMet(p)) metCount += 1
  })
  return { totalSaved, totalGoal, potCount: pots.length, metCount, unallocated }
}

export function useSavingsSummary() {
  const { pots, unallocated } = useSavings()
  return { totals: savingsTotals(pots, unallocated) }
}
