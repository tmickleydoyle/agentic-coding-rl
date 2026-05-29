'use client'
import { useState } from 'react'
import type { Row, SortKey } from './types'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

export default function DataTable({ rows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const sorted = [...rows].sort((a, b) => {
    if (sortKey === 'name') return a.name.localeCompare(b.name)
    return a.age - b.age
  })
  return (
    <table data-testid="table">
      <TableHeader sortKey={sortKey} onSort={setSortKey} />
      <tbody>
        {sorted.map((r) => (
          <TableRow key={r.id} row={r} />
        ))}
      </tbody>
    </table>
  )
}
