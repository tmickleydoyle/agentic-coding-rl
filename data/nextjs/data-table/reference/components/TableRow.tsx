'use client'
import type { Row } from './types'

export default function TableRow({ row }: { row: Row }) {
  return (
    <tr data-testid={`row-${row.id}`}>
      <td>{row.name}</td>
      <td>{row.age}</td>
    </tr>
  )
}
