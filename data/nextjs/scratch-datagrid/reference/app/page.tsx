'use client'
import { useState } from 'react'

type Row = { name: string; age: number; city: string }
type SortKey = 'name' | 'age' | 'city'

const DATA: Row[] = [
  { name: 'Alice', age: 30, city: 'Paris' },
  { name: 'Bob', age: 25, city: 'Lyon' },
  { name: 'Carol', age: 35, city: 'Nice' },
  { name: 'Dave', age: 28, city: 'Paris' },
  { name: 'Eve', age: 42, city: 'Lyon' },
  { name: 'Frank', age: 22, city: 'Nice' },
  { name: 'Grace', age: 38, city: 'Paris' },
  { name: 'Heidi', age: 27, city: 'Lyon' },
  { name: 'Ivan', age: 33, city: 'Nice' },
  { name: 'Judy', age: 29, city: 'Paris' },
  { name: 'Mallory', age: 45, city: 'Lyon' },
  { name: 'Niaj', age: 24, city: 'Nice' },
]
const PAGE_SIZE = 5

export default function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<string[]>([])

  function sortBy(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  function onSearch(v: string) {
    setQuery(v)
    setPage(0)
  }

  function toggle(name: string) {
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]))
  }

  const q = query.trim().toLowerCase()
  const filtered = DATA.filter((r) => r.name.toLowerCase().includes(q))
  const sorted = [...filtered]
  if (sortKey) {
    sorted.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'age') cmp = a.age - b.age
      else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages - 1)
  const pageRows = sorted.slice(clampedPage * PAGE_SIZE, clampedPage * PAGE_SIZE + PAGE_SIZE)

  function arrow(key: SortKey) {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' ▲' : ' ▼'
  }

  return (
    <div>
      <h1>People Directory</h1>
      <input
        aria-label="Search"
        placeholder="Search by name"
        value={query}
        onChange={(e) => onSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>
              <button onClick={() => sortBy('name')}>Name{arrow('name')}</button>
            </th>
            <th>
              <button onClick={() => sortBy('age')}>Age{arrow('age')}</button>
            </th>
            <th>
              <button onClick={() => sortBy('city')}>City{arrow('city')}</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r) => (
            <tr key={r.name}>
              <td>
                <input
                  type="checkbox"
                  aria-label={`Select ${r.name}`}
                  checked={selected.includes(r.name)}
                  onChange={() => toggle(r.name)}
                />
              </td>
              <td>{r.name}</td>
              <td>{r.age}</td>
              <td>{r.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={clampedPage === 0}>
          Previous
        </button>
        <span>{`Page ${clampedPage + 1} of ${totalPages}`}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={clampedPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
      <p>{`Selected: ${selected.length}`}</p>
    </div>
  )
}
