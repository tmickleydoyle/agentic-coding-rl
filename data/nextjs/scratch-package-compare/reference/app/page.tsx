'use client'
import { useState } from 'react'

interface Pkg {
  id: number
  name: string
  weeklyDownloads: number
  stars: number
  openIssues: number
  lastPublished: string
  license: string
  size: number
}

const SEED: Pkg[] = [
  { id: 1, name: 'lodash', weeklyDownloads: 45000000, stars: 58000, openIssues: 120, lastPublished: '2023-06-01', license: 'MIT', size: 71 },
  { id: 2, name: 'underscore', weeklyDownloads: 8000000, stars: 27000, openIssues: 85, lastPublished: '2023-01-15', license: 'MIT', size: 55 },
  { id: 3, name: 'ramda', weeklyDownloads: 3000000, stars: 23000, openIssues: 210, lastPublished: '2023-09-10', license: 'MIT', size: 43 },
  { id: 4, name: 'date-fns', weeklyDownloads: 22000000, stars: 33000, openIssues: 95, lastPublished: '2023-10-05', license: 'MIT', size: 78 },
  { id: 5, name: 'moment', weeklyDownloads: 15000000, stars: 47000, openIssues: 310, lastPublished: '2022-11-20', license: 'MIT', size: 300 },
  { id: 6, name: 'axios', weeklyDownloads: 50000000, stars: 103000, openIssues: 520, lastPublished: '2023-11-01', license: 'MIT', size: 14 },
]

type SortKey = 'downloads' | 'stars' | 'size' | 'issues'

function sortPackages(pkgs: Pkg[], key: SortKey): Pkg[] {
  const copy = pkgs.slice()
  copy.sort((a, b) => {
    if (key === 'downloads') return b.weeklyDownloads - a.weeklyDownloads
    if (key === 'stars') return b.stars - a.stars
    if (key === 'size') return a.size - b.size
    if (key === 'issues') return a.openIssues - b.openIssues
    return 0
  })
  return copy
}

export default function App() {
  const [packages] = useState<Pkg[]>(SEED.map(p => ({ ...p })))
  const [sortKey, setSortKey] = useState<SortKey>('downloads')
  const [selected, setSelected] = useState<number[]>([])

  const sorted = sortPackages(packages, sortKey)

  function handleSelect(id: number) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  function handleClear() {
    setSelected([])
  }

  const pkgA = selected.length === 2 ? packages.find(p => p.id === selected[0]) : null
  const pkgB = selected.length === 2 ? packages.find(p => p.id === selected[1]) : null

  return (
    <div>
      <h1 data-testid="heading">Package Compare</h1>

      <div>
        <select
          data-testid="sort-select"
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
        >
          <option value="downloads">downloads</option>
          <option value="stars">stars</option>
          <option value="size">size</option>
          <option value="issues">issues</option>
        </select>
        <button data-testid="clear-selection" onClick={handleClear}>Clear selection</button>
      </div>

      <ul>
        {sorted.map(p => (
          <li key={p.id} data-testid={`pkg-item-${p.id}`}>
            <input
              type="checkbox"
              data-testid={`select-${p.id}`}
              checked={selected.includes(p.id)}
              onChange={() => handleSelect(p.id)}
            />
            <span data-testid={`pkg-name-${p.id}`}>{p.name}</span>
            <span data-testid={`pkg-downloads-${p.id}`}>{p.weeklyDownloads}</span>
            <span data-testid={`pkg-stars-${p.id}`}>{p.stars}</span>
            <span data-testid={`pkg-size-${p.id}`}>{p.size}</span>
          </li>
        ))}
      </ul>

      {pkgA && pkgB && (
        <div data-testid="compare-panel">
          <span data-testid="compare-winner-downloads">
            {pkgA.weeklyDownloads >= pkgB.weeklyDownloads ? pkgA.name : pkgB.name}
          </span>
          <span data-testid="compare-winner-stars">
            {pkgA.stars >= pkgB.stars ? pkgA.name : pkgB.name}
          </span>
          <span data-testid="compare-winner-size">
            {pkgA.size <= pkgB.size ? pkgA.name : pkgB.name}
          </span>
        </div>
      )}
    </div>
  )
}
