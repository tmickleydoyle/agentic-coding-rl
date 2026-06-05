import type { Sale } from './types'
import { SERVICES, priceOf } from './types'

export type ServiceStat = { name: string; count: number; revenue: number }

export function serviceStats(sales: Sale[]): ServiceStat[] {
  return SERVICES.map((svc) => {
    const mine = sales.filter((s) => s.service === svc.name)
    const revenue = mine.reduce((sum, s) => sum + priceOf(s.service) + s.tip, 0)
    return { name: svc.name, count: mine.length, revenue }
  })
}

export function topService(sales: Sale[]): string {
  const stats = serviceStats(sales)
  let best: ServiceStat | null = null
  for (let i = 0; i < stats.length; i++) {
    const st = stats[i]
    if (st.revenue > 0 && (best === null || st.revenue > best.revenue)) best = st
  }
  return best ? best.name : 'None'
}
