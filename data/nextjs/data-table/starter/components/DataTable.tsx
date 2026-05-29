'use client'
import { useState } from 'react'
import type { Row, SortKey } from './types'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

// TODO: track sort key (default 'name'). Sort rows ascending by the current key
// (lexicographic for strings, numeric for numbers). Render <table data-testid="table">
// containing TableHeader and a <tbody> of TableRows in sorted order.
export default function DataTable({ rows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  return <table data-testid="table" />
}
