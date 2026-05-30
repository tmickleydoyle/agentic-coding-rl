'use client'
import { usePortfolio } from '../components/PortfolioProvider'
import type { Coin } from '../lib/types'

export function coinValue(coin: Coin): number {
  return coin.amount * coin.price
}

// Static dollar change over 24h, derived from the coin's static change24h percent.
export function changeAmount(coin: Coin): number {
  return Math.round(coinValue(coin) * (coin.change24h / 100))
}

export function isUp(coin: Coin): boolean {
  return coin.change24h >= 0
}

export function totalValue(coins: Coin[]): number {
  let sum = 0
  coins.forEach((c) => {
    sum += coinValue(c)
  })
  return sum
}

export function totalChange(coins: Coin[]): number {
  let sum = 0
  coins.forEach((c) => {
    sum += changeAmount(c)
  })
  return sum
}

export function allocationPercent(coin: Coin, coins: Coin[]): number {
  const total = totalValue(coins)
  if (total <= 0) return 0
  return Math.round((coinValue(coin) / total) * 100)
}

export type PortfolioTotals = {
  totalValue: number
  totalChange: number
  totalChangePercent: number
  coinCount: number
}

export function totalsOf(coins: Coin[]): PortfolioTotals {
  const value = totalValue(coins)
  const change = totalChange(coins)
  const changePct = value - change > 0 ? Math.round((change / (value - change)) * 100) : 0
  return {
    totalValue: value,
    totalChange: change,
    totalChangePercent: changePct,
    coinCount: coins.length,
  }
}

export function usePortfolioSummary() {
  const { coins } = usePortfolio()
  const totals = totalsOf(coins)
  return { totals }
}
