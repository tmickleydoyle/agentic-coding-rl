'use client'
import { useWatchlist } from '../components/WatchlistProvider'
import type { Ticker } from '../lib/types'

export function alertHit(ticker: Ticker): boolean {
  return ticker.direction === 'above'
    ? ticker.price >= ticker.targetPrice
    : ticker.price <= ticker.targetPrice
}

// Signed distance from the current price to the target.
export function distanceToTarget(ticker: Ticker): number {
  return ticker.targetPrice - ticker.price
}

export function alertsOf(tickers: Ticker[]): Ticker[] {
  return tickers.filter((t) => alertHit(t))
}

export type WatchlistTotals = {
  tickerCount: number
  alertCount: number
}

export function totalsOf(tickers: Ticker[]): WatchlistTotals {
  let alertCount = 0
  tickers.forEach((t) => {
    if (alertHit(t)) alertCount += 1
  })
  return { tickerCount: tickers.length, alertCount }
}

export function useWatchlistSummary() {
  const { tickers } = useWatchlist()
  const totals = totalsOf(tickers)
  return { totals }
}
