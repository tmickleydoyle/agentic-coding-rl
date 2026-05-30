'use client'
import { useSubs } from '../components/SubsProvider'
import { DUE_SOON_DAYS, TODAY, type Subscription } from '../lib/types'

export function monthlyCost(sub: Subscription): number {
  return sub.cycle === 'annual' ? sub.cost / 12 : sub.cost
}

export function daysUntil(dateIso: string, today: string = TODAY): number {
  const a = Date.parse(`${today}T00:00:00Z`)
  const b = Date.parse(`${dateIso}T00:00:00Z`)
  return Math.round((b - a) / 86400000)
}

export function isDueSoon(sub: Subscription, today: string = TODAY): boolean {
  if (!sub.active) return false
  const d = daysUntil(sub.nextRenewal, today)
  return d >= 0 && d <= DUE_SOON_DAYS
}

export type SubsSummary = {
  monthlyTotal: number
  annualTotal: number
  activeCount: number
  dueSoonCount: number
}

export function summarize(subs: Subscription[], today: string = TODAY): SubsSummary {
  let monthlyTotal = 0
  let activeCount = 0
  let dueSoonCount = 0
  subs.forEach((s) => {
    if (s.active) {
      activeCount += 1
      monthlyTotal += monthlyCost(s)
      if (isDueSoon(s, today)) dueSoonCount += 1
    }
  })
  return {
    monthlyTotal,
    annualTotal: monthlyTotal * 12,
    activeCount,
    dueSoonCount,
  }
}

export function upcomingRenewals(subs: Subscription[], today: string = TODAY): Subscription[] {
  return subs
    .filter((s) => isDueSoon(s, today))
    .slice()
    .sort((a, b) => daysUntil(a.nextRenewal, today) - daysUntil(b.nextRenewal, today))
}

export function useSubsSummary() {
  const { subscriptions } = useSubs()
  const summary = summarize(subscriptions)
  const upcoming = upcomingRenewals(subscriptions)
  return { summary, upcoming }
}
