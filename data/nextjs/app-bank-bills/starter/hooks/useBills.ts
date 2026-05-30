'use client'
import { useBills } from '../components/BillsProvider'
import type { Bill } from '../lib/types'

export type BillTotals = {
  total: number
  paidCount: number
  unpaidCount: number
  autopayCount: number
}

export function upcomingBills(_bills: Bill[], _today: number): Bill[] {
  // TODO: unpaid bills with dueDay >= today, sorted ascending by dueDay
  return []
}

export function overdueBills(_bills: Bill[], _today: number): Bill[] {
  // TODO: unpaid bills with dueDay < today
  return []
}

export function billStatus(
  _bill: Bill,
  _today: number,
): 'paid' | 'overdue' | 'upcoming' {
  // TODO: 'paid' if paid, else 'overdue' when dueDay < today, else 'upcoming'
  return 'upcoming'
}

export function billTotals(_bills: Bill[]): BillTotals {
  // TODO: total amount, paid/unpaid counts, autopay count
  return { total: 0, paidCount: 0, unpaidCount: 0, autopayCount: 0 }
}

export function useBillsSummary() {
  const { bills, today } = useBills()
  return {
    totals: billTotals(bills),
    upcomingCount: upcomingBills(bills, today).length,
    overdueCount: overdueBills(bills, today).length,
  }
}
