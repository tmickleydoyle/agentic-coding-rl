'use client'
import { useBills } from '../components/BillsProvider'
import type { Bill } from '../lib/types'

export type BillTotals = {
  total: number
  paidCount: number
  unpaidCount: number
  autopayCount: number
}

export function upcomingBills(bills: Bill[], today: number): Bill[] {
  return bills
    .filter((b) => !b.paid && b.dueDay >= today)
    .slice()
    .sort((a, b) => a.dueDay - b.dueDay)
}

export function overdueBills(bills: Bill[], today: number): Bill[] {
  return bills.filter((b) => !b.paid && b.dueDay < today)
}

export function billStatus(bill: Bill, today: number): 'paid' | 'overdue' | 'upcoming' {
  if (bill.paid) return 'paid'
  return bill.dueDay < today ? 'overdue' : 'upcoming'
}

export function billTotals(bills: Bill[]): BillTotals {
  let total = 0
  let paidCount = 0
  let unpaidCount = 0
  let autopayCount = 0
  bills.forEach((b) => {
    total += b.amount
    if (b.paid) paidCount += 1
    else unpaidCount += 1
    if (b.autopay) autopayCount += 1
  })
  return { total, paidCount, unpaidCount, autopayCount }
}

export function useBillsSummary() {
  const { bills, today } = useBills()
  return {
    totals: billTotals(bills),
    upcomingCount: upcomingBills(bills, today).length,
    overdueCount: overdueBills(bills, today).length,
  }
}
