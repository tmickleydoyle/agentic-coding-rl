'use client'
import { useSubs } from '../components/SubsProvider'
import { TODAY, type Subscription } from '../lib/types'

export function monthlyCost(sub: Subscription): number {
  // TODO: cost for monthly, cost/12 for annual
  void sub
  return 0
}

export function daysUntil(_dateIso: string, _today: string = TODAY): number {
  // TODO: whole days between today and the date
  return 0
}

export function isDueSoon(_sub: Subscription, _today: string = TODAY): boolean {
  // TODO: active and 0 <= daysUntil <= DUE_SOON_DAYS
  return false
}

export type SubsSummary = {
  monthlyTotal: number
  annualTotal: number
  activeCount: number
  dueSoonCount: number
}

export function summarize(_subs: Subscription[], _today: string = TODAY): SubsSummary {
  // TODO: total normalized monthly cost over active subs, plus counts
  return { monthlyTotal: 0, annualTotal: 0, activeCount: 0, dueSoonCount: 0 }
}

export function upcomingRenewals(_subs: Subscription[], _today: string = TODAY): Subscription[] {
  // TODO: due-soon active subs sorted by days ascending
  return []
}

export function useSubsSummary() {
  const { subscriptions } = useSubs()
  const summary = summarize(subscriptions)
  const upcoming = upcomingRenewals(subscriptions)
  return { summary, upcoming }
}
