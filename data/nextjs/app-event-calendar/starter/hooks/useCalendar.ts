'use client'
import { useApp } from '../components/AppStateProvider'
import { CATEGORIES } from '../lib/types'

export function useCalendar() {
  // TODO: derive cells (FIRST_WEEKDAY leading nulls then 1..DAYS_IN_MONTH), countByCategory
  // (category -> count over all events), and categories from the shared events state.
  useApp()
  const cells: (number | null)[] = []
  const countByCategory: Record<string, number> = {}
  return { cells, countByCategory, categories: CATEGORIES }
}
