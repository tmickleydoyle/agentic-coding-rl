'use client'
import type { Person } from './types'
import { useTable } from '../hooks/useTable'
import Toolbar from './Toolbar'

export default function Table({ rows }: { rows: Person[] }) {
  const {
    filter,
    setFilter,
    toggleSort,
    page,
    setPage,
    pageRows,
    pageCount,
  } = useTable(rows)

  return (
    <div>
      <Toolbar filter={filter} onFilter={setFilter} />
      <table data-testid="table">
        <thead>
          <tr>
            <th>
              <button data-testid="sort-name" onClick={() => toggleSort('name')}>
                Name
              </button>
            </th>
            <th>
              <button data-testid="sort-age" onClick={() => toggleSort('age')}>
                Age
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r) => (
            <tr key={r.id} data-testid={`row-${r.id}`}>
              <td>{r.name}</td>
              <td>{r.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button data-testid="prev" disabled={page === 0} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span data-testid="page-info">
          {page + 1} / {pageCount}
        </span>
        <button
          data-testid="next"
          disabled={page >= pageCount - 1}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
