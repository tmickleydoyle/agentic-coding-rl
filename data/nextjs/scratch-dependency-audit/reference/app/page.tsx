'use client'
import { useState } from 'react'

type Severity = 'none' | 'low' | 'medium' | 'high' | 'critical'
type PkgType = 'production' | 'dev'

interface Pkg {
  id: number
  name: string
  version: string
  type: PkgType
  severity: Severity
  outdated: boolean
}

const SEED: Pkg[] = [
  { id: 1, name: 'lodash', version: '4.17.21', type: 'production', severity: 'none', outdated: false },
  { id: 2, name: 'axios', version: '0.21.1', type: 'production', severity: 'high', outdated: true },
  { id: 3, name: 'jest', version: '27.0.0', type: 'dev', severity: 'none', outdated: true },
  { id: 4, name: 'express', version: '4.18.2', type: 'production', severity: 'medium', outdated: false },
  { id: 5, name: 'eslint', version: '8.0.0', type: 'dev', severity: 'none', outdated: false },
  { id: 6, name: 'moment', version: '2.29.1', type: 'production', severity: 'low', outdated: true },
  { id: 7, name: 'webpack', version: '5.75.0', type: 'dev', severity: 'none', outdated: false },
  { id: 8, name: 'react-scripts', version: '5.0.0', type: 'dev', severity: 'critical', outdated: true },
]

const SEVERITIES: Severity[] = ['none', 'low', 'medium', 'high', 'critical']

export default function App() {
  const [packages, setPackages] = useState<Pkg[]>(SEED.map(p => ({ ...p })))
  const [typeFilter, setTypeFilter] = useState<PkgType | 'All'>('All')
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All')
  const [outdatedOnly, setOutdatedOnly] = useState(false)

  const filtered = packages.filter(p => {
    const typeOk = typeFilter === 'All' || p.type === typeFilter
    const sevOk = severityFilter === 'All' || p.severity === severityFilter
    const outOk = !outdatedOnly || p.outdated
    return typeOk && sevOk && outOk
  })

  const criticalCount = filtered.filter(p => p.severity === 'critical').length
  const outdatedCount = filtered.filter(p => p.outdated).length

  function handleResolve(id: number) {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, severity: 'none' } : p))
  }

  function handleRemove(id: number) {
    setPackages(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      <h1 data-testid="heading">Dependency Audit</h1>

      <div>
        <span data-testid="count-critical">{criticalCount}</span>
        <span> critical </span>
        <span data-testid="count-outdated">{outdatedCount}</span>
        <span> outdated</span>
      </div>

      <div>
        <button data-testid="filter-all" onClick={() => setTypeFilter('All')}>All</button>
        <button data-testid="filter-production" onClick={() => setTypeFilter('production')}>production</button>
        <button data-testid="filter-dev" onClick={() => setTypeFilter('dev')}>dev</button>
      </div>

      <div>
        <select
          data-testid="severity-select"
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value as Severity | 'All')}
        >
          <option value="All">All</option>
          {SEVERITIES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="checkbox"
          data-testid="outdated-checkbox"
          checked={outdatedOnly}
          onChange={e => setOutdatedOnly(e.target.checked)}
        />
        <label>Outdated only</label>
      </div>

      <div data-testid="pkg-count">{filtered.length} packages</div>

      <ul>
        {filtered.map(p => (
          <li key={p.id} data-testid={`pkg-item-${p.id}`}>
            <span data-testid={`pkg-name-${p.id}`}>{p.name}</span>
            <span data-testid={`pkg-version-${p.id}`}>{p.version}</span>
            <span data-testid={`pkg-severity-${p.id}`}>{p.severity}</span>
            <span data-testid={`pkg-type-${p.id}`}>{p.type}</span>
            <button data-testid={`resolve-${p.id}`} onClick={() => handleResolve(p.id)}>Resolve</button>
            <button data-testid={`remove-${p.id}`} onClick={() => handleRemove(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
