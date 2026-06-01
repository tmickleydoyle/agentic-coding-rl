'use client'
import { useApp } from '../components/AppStateProvider'
import type { DateRange, PageStat } from '../lib/types'

export function viewsForRange(page: PageStat, range: DateRange): number {
  if (range === '7d') return page.range7d
  if (range === '30d') return page.range30d
  return page.views
}

export type Totals = {
  totalViews: number
  totalSessions: number
  avgBounceRate: number
}

export function totals(pages: PageStat[], range: DateRange): Totals {
  let totalViews = 0
  let totalSessions = 0
  let bounceSum = 0
  pages.forEach((p) => {
    totalViews += viewsForRange(p, range)
    totalSessions += p.sessions
    bounceSum += p.bounceRate
  })
  const avgBounceRate = pages.length === 0 ? 0 : Math.round(bounceSum / pages.length)
  return { totalViews, totalSessions, avgBounceRate }
}

export function topPages(pages: PageStat[], range: DateRange, n: number): PageStat[] {
  const indexed = pages.map((p, i) => ({ p, i }))
  indexed.sort((a, b) => {
    const diff = viewsForRange(b.p, range) - viewsForRange(a.p, range)
    if (diff !== 0) return diff
    return a.i - b.i
  })
  return indexed.slice(0, n).map((x) => x.p)
}

export function useMetrics() {
  const { pages, range } = useApp()
  return {
    totals: totals(pages, range),
    topPages: (n: number) => topPages(pages, range, n),
    viewsFor: (page: PageStat) => viewsForRange(page, range),
  }
}
