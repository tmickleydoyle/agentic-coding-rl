'use client'
import { usePortfolio } from '../components/PortfolioProvider'
import type { Holding } from '../lib/types'

export function marketValue(holding: Holding): number {
  return holding.shares * holding.price
}

export function costValue(holding: Holding): number {
  return holding.shares * holding.costBasis
}

export function gainLoss(holding: Holding): number {
  return marketValue(holding) - costValue(holding)
}

export function gainLossPercent(holding: Holding): number {
  const cost = costValue(holding)
  if (cost <= 0) return 0
  return Math.round((gainLoss(holding) / cost) * 100)
}

export function isGain(holding: Holding): boolean {
  return gainLoss(holding) >= 0
}

export function totalValue(holdings: Holding[]): number {
  let sum = 0
  holdings.forEach((h) => {
    sum += marketValue(h)
  })
  return sum
}

export function allocationPercent(holding: Holding, holdings: Holding[]): number {
  const total = totalValue(holdings)
  if (total <= 0) return 0
  return Math.round((marketValue(holding) / total) * 100)
}

export type PortfolioTotals = {
  totalValue: number
  totalCost: number
  totalGainLoss: number
  totalGainLossPercent: number
  holdingCount: number
}

export function totalsOf(holdings: Holding[]): PortfolioTotals {
  let value = 0
  let cost = 0
  holdings.forEach((h) => {
    value += marketValue(h)
    cost += costValue(h)
  })
  const gl = value - cost
  const glPct = cost > 0 ? Math.round((gl / cost) * 100) : 0
  return {
    totalValue: value,
    totalCost: cost,
    totalGainLoss: gl,
    totalGainLossPercent: glPct,
    holdingCount: holdings.length,
  }
}

export function usePortfolioSummary() {
  const { holdings } = usePortfolio()
  const totals = totalsOf(holdings)
  return { totals }
}
