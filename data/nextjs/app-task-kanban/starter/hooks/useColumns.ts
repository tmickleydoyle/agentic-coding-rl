'use client'
import { useBoard } from '../components/BoardProvider'
import type { Card, Column } from '../lib/types'
import { COLUMNS } from '../lib/types'

export function groupByColumn(_cards: Card[]): Record<Column, Card[]> {
  // TODO: group non-archived cards by column, preserving order
  return { backlog: [], doing: [], done: [] }
}

export function countByColumn(_cards: Card[]): Record<Column, number> {
  // TODO: count non-archived cards per column
  return { backlog: 0, doing: 0, done: 0 }
}

export function useColumns() {
  const { cards } = useBoard()
  const byColumn = groupByColumn(cards)
  const counts = countByColumn(cards)
  const overLimit: Record<Column, boolean> = {
    backlog: false,
    doing: false,
    done: false,
  }
  return { byColumn, counts, overLimit, columns: COLUMNS }
}
