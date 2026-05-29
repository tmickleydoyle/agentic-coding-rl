'use client'
import type { Person } from './types'
import { useTable } from '../hooks/useTable'
import Toolbar from './Toolbar'

// TODO: use useTable. Render <Toolbar />, a <table data-testid="table"> with header buttons
// data-testid="sort-name"/"sort-age" (call toggleSort) and a <tbody> of <tr data-testid="row-<id>">
// (name, age cells) for pageRows, plus pagination: <button data-testid="prev"> (disabled on page 0),
// <button data-testid="next"> (disabled on last page), <span data-testid="page-info">{page+1} / {pageCount}</span>.
export default function Table({ rows }: { rows: Person[] }) {
  const { filter, setFilter } = useTable(rows)
  return (
    <div>
      <Toolbar filter={filter} onFilter={setFilter} />
      <table data-testid="table" />
    </div>
  )
}
