'use client'
import type { Table } from '../lib/types'

export default function TableCard({
  table,
  reservationCount,
}: {
  table: Table
  reservationCount: number
}) {
  return (
    <li data-testid={`table-${table.id}`}>
      <span data-testid={`table-${table.id}-name`}>{table.name}</span>
      <span data-testid={`table-${table.id}-capacity`}>{table.capacity}</span>
      <span data-testid={`table-${table.id}-reservations`}>{reservationCount}</span>
    </li>
  )
}
