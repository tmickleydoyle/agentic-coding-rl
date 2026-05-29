'use client'
import type { Row } from './types'

// TODO: render <tr data-testid={`row-${row.id}`}><td>{row.name}</td><td>{row.age}</td></tr>.
export default function TableRow({ row }: { row: Row }) {
  return <tr />
}
