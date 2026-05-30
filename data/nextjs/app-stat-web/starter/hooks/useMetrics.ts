'use client'
import { useApp } from '../components/AppStateProvider'
import type { DateRange, PageStat } from '../lib/types'

export function viewsForRange(_page: PageStat, _range: DateRange): number {
  // TODO: range7d for '7d', range30d for '30d', else all-time views
  return 0
}

export type Totals = {
  totalViews: number
  totalSessions: number
  avgBounceRate: number
}

export function totals(_pages: PageStat[], _range: DateRange): Totals {
  // TODO: sum range-adjusted views + sessions, average the bounce rate
  return { totalViews: 0, totalSessions: 0, avgBounceRate: 0 }
}

export function topPages(_pages: PageStat[], _range: DateRange, _n: number): PageStat[] {
  // TODO: return the n pages with the highest range-adjusted views, descending
  return []
}

export function useMetrics() {
  const { pages, range } = useApp()
  return {
    totals: totals(pages, range),
    topPages: (n: number) => topPages(pages, range, n),
    viewsFor: (page: PageStat) => viewsForRange(page, range),
  }
}
