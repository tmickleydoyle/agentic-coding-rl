'use client'
import { useBoard } from '../components/BoardProvider'
import type { Card, Column } from '../lib/types'
import { COLUMNS } from '../lib/types'

export function groupByColumn(cards: Card[]): Record<Column, Card[]> {
  const out: Record<Column, Card[]> = { backlog: [], doing: [], done: [] }
  cards.forEach((c) => {
    if (c.archived) return
    out[c.column].push(c)
  })
  return out
}

export function countByColumn(cards: Card[]): Record<Column, number> {
  const grouped = groupByColumn(cards)
  return {
    backlog: grouped.backlog.length,
    doing: grouped.doing.length,
    done: grouped.done.length,
  }
}

export function useColumns() {
  const { cards, wipLimit } = useBoard()
  const byColumn = groupByColumn(cards)
  const counts = countByColumn(cards)
  const overLimit: Record<Column, boolean> = {
    backlog: counts.backlog > wipLimit,
    doing: counts.doing > wipLimit,
    done: counts.done > wipLimit,
  }
  return { byColumn, counts, overLimit, columns: COLUMNS }
}
