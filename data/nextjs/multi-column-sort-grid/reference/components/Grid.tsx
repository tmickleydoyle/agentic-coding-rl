'use client'
import { useEffect, useRef } from 'react'
import type { Person } from './types'
import { useGrid } from '../hooks/useGrid'
import HeaderCell from './HeaderCell'

export default function Grid({ rows }: { rows: Person[] }) {
  const {
    sorts,
    toggleSort,
    sortedRows,
    selected,
    toggleRow,
    toggleAll,
    allSelected,
    someSelected,
  } = useGrid(rows)

  const selectAllRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  return (
    <table data-testid="grid">
      <thead>
        <tr>
          <th>
            <input
              ref={selectAllRef}
              type="checkbox"
              data-testid="select-all"
              checked={allSelected}
              onChange={toggleAll}
            />
          </th>
          <HeaderCell label="Name" sortKey="name" sorts={sorts} onSort={toggleSort} />
          <HeaderCell label="Age" sortKey="age" sorts={sorts} onSort={toggleSort} />
          <HeaderCell label="City" sortKey="city" sorts={sorts} onSort={toggleSort} />
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((r) => (
          <tr key={r.id} data-testid={`row-${r.id}`}>
            <td>
              <input
                type="checkbox"
                data-testid={`select-${r.id}`}
                checked={selected.has(r.id)}
                onChange={() => toggleRow(r.id)}
              />
            </td>
            <td>{r.name}</td>
            <td>{r.age}</td>
            <td>{r.city}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
