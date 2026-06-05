'use client'
import { useRebalance } from '../components/RebalanceProvider'
import type { Action, Holding } from '../lib/types'

export function totalValue(holdings: Holding[]): number {
  let sum = 0
  holdings.forEach((h) => {
    sum += h.value
  })
  return sum
}

export function actualPercent(holding: Holding, holdings: Holding[]): number {
  const total = totalValue(holdings)
  if (total <= 0) return 0
  return Math.round((holding.value / total) * 100)
}

export function targetValue(holding: Holding, holdings: Holding[]): number {
  const total = totalValue(holdings)
  return Math.round((total * holding.targetPercent) / 100)
}

// Signed dollar amount to bring this holding to target: positive => BUY, negative => SELL.
export function driftAmount(holding: Holding, holdings: Holding[]): number {
  return targetValue(holding, holdings) - holding.value
}

export function suggestedAction(holding: Holding, holdings: Holding[]): Action {
  const drift = driftAmount(holding, holdings)
  if (drift > 0) return 'BUY'
  if (drift < 0) return 'SELL'
  return 'HOLD'
}

export type Suggestion = {
  holding: Holding
  action: Action
  amount: number // absolute dollar amount to trade
}

export function suggestionsOf(holdings: Holding[]): Suggestion[] {
  return holdings.map((h) => {
    const drift = driftAmount(h, holdings)
    return {
      holding: h,
      action: suggestedAction(h, holdings),
      amount: Math.abs(drift),
    }
  })
}

export function totalTargetPercent(holdings: Holding[]): number {
  let sum = 0
  holdings.forEach((h) => {
    sum += h.targetPercent
  })
  return sum
}

export function isBalanced(holdings: Holding[]): boolean {
  return holdings.every((h) => driftAmount(h, holdings) === 0)
}

export type RebalanceTotals = {
  totalValue: number
  totalTargetPercent: number
  holdingCount: number
  balanced: boolean
}

export function totalsOf(holdings: Holding[]): RebalanceTotals {
  return {
    totalValue: totalValue(holdings),
    totalTargetPercent: totalTargetPercent(holdings),
    holdingCount: holdings.length,
    balanced: isBalanced(holdings),
  }
}

export function useRebalanceSummary() {
  const { holdings } = useRebalance()
  const totals = totalsOf(holdings)
  return { totals }
}
