'use client'
import { useApp } from '../components/AppStateProvider'
import { CATEGORIES, DAYS_IN_MONTH, FIRST_WEEKDAY } from '../lib/types'

export function buildCells(firstWeekday: number, daysInMonth: number): (number | null)[] {
  const cells: (number | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

export function useCalendar() {
  const { events } = useApp()

  const cells = buildCells(FIRST_WEEKDAY, DAYS_IN_MONTH)

  const countByCategory: Record<string, number> = {}
  CATEGORIES.forEach((c) => {
    countByCategory[c] = 0
  })
  events.forEach((e) => {
    countByCategory[e.category] = (countByCategory[e.category] ?? 0) + 1
  })

  return { cells, countByCategory, categories: CATEGORIES }
}
