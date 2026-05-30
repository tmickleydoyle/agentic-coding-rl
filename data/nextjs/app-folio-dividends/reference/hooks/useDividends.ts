'use client'
import { useDividends } from '../components/DividendsProvider'
import { MONTH_NAMES, type Holding } from '../lib/types'

export function annualIncome(holding: Holding): number {
  return holding.shares * holding.dividendPerShare
}

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? ''
}

export function totalAnnualIncome(holdings: Holding[]): number {
  let sum = 0
  holdings.forEach((h) => {
    sum += annualIncome(h)
  })
  return sum
}

export function monthlyAverage(holdings: Holding[]): number {
  return Math.round(totalAnnualIncome(holdings) / 12)
}

export type CalendarMonth = {
  month: number
  name: string
  income: number
  holdings: Holding[]
}

// One entry per month that has at least one paying holding, ordered by month.
export function calendarOf(holdings: Holding[]): CalendarMonth[] {
  const byMonth = new Map<number, Holding[]>()
  holdings.forEach((h) => {
    const list = byMonth.get(h.payMonth) ?? []
    list.push(h)
    byMonth.set(h.payMonth, list)
  })
  const months = Array.from(byMonth.keys()).sort((a, b) => a - b)
  return months.map((month) => {
    const list = byMonth.get(month) ?? []
    let income = 0
    list.forEach((h) => {
      income += annualIncome(h)
    })
    return { month, name: monthName(month), income, holdings: list }
  })
}

export type DividendsTotals = {
  totalIncome: number
  monthlyAverage: number
  holdingCount: number
  payingMonths: number
}

export function totalsOf(holdings: Holding[]): DividendsTotals {
  return {
    totalIncome: totalAnnualIncome(holdings),
    monthlyAverage: monthlyAverage(holdings),
    holdingCount: holdings.length,
    payingMonths: calendarOf(holdings).length,
  }
}

export function useDividendsSummary() {
  const { holdings } = useDividends()
  const totals = totalsOf(holdings)
  return { totals }
}
