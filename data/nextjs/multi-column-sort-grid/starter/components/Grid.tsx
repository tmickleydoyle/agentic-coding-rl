'use client'
import type { Person } from './types'
import { useGrid } from '../hooks/useGrid'
import HeaderCell from './HeaderCell'

// TODO: render <table data-testid="grid"> with a header row: a <th> with
// <input type="checkbox" data-testid="select-all"> (checked=allSelected, DOM .indeterminate=
// someSelected, onChange->toggleAll) then a <HeaderCell> for name/age/city. Then one
// <tr data-testid={`row-${id}`}> per sortedRows row, each starting with
// <input type="checkbox" data-testid={`select-${id}`}> (checked=selected, onChange->toggleRow),
// then name/age/city cells.
export default function Grid({ rows }: { rows: Person[] }) {
  const { sortedRows } = useGrid(rows)
  return <table data-testid="grid" />
}
