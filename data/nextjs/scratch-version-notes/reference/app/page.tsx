'use client'
import { useState } from 'react'

type ReleaseType = 'major' | 'minor' | 'patch'

interface Release {
  id: number
  version: string
  package: string
  type: ReleaseType
  date: string
  notes: string
  breaking: boolean
}

const SEED: Release[] = [
  { id: 1, version: '3.0.0', package: 'myapp', type: 'major', date: '2023-11-01', notes: 'Complete rewrite with new architecture', breaking: true },
  { id: 2, version: '2.5.0', package: 'myapp', type: 'minor', date: '2023-09-15', notes: 'Added dark mode support', breaking: false },
  { id: 3, version: '2.4.2', package: 'myapp', type: 'patch', date: '2023-08-10', notes: 'Fixed memory leak in parser', breaking: false },
  { id: 4, version: '2.4.1', package: 'myapp', type: 'patch', date: '2023-07-05', notes: 'Fixed null pointer exception', breaking: false },
  { id: 5, version: '1.0.0', package: 'plugin-a', type: 'major', date: '2023-06-01', notes: 'Initial stable release', breaking: false },
  { id: 6, version: '0.9.0', package: 'plugin-a', type: 'minor', date: '2023-05-10', notes: 'Beta feature additions', breaking: false },
  { id: 7, version: '2.0.0', package: 'plugin-b', type: 'major', date: '2023-10-20', notes: 'Breaking API changes for v2', breaking: true },
  { id: 8, version: '1.2.0', package: 'plugin-b', type: 'minor', date: '2023-04-15', notes: 'New event hooks', breaking: false },
]

const PACKAGES = ['myapp', 'plugin-a', 'plugin-b']
const TYPES: ReleaseType[] = ['major', 'minor', 'patch']
const TODAY = '2023-12-01'

export default function App() {
  const [releases, setReleases] = useState<Release[]>(SEED.map(r => ({ ...r })))
  const [typeFilter, setTypeFilter] = useState<ReleaseType | 'All'>('All')
  const [packageFilter, setPackageFilter] = useState<string>('All')
  const [breakingOnly, setBreakingOnly] = useState(false)
  const [addVersion, setAddVersion] = useState('')
  const [addPkg, setAddPkg] = useState<string>(PACKAGES[0])
  const [addType, setAddType] = useState<ReleaseType>('minor')
  const [addNotes, setAddNotes] = useState('')

  const sorted = releases.slice().sort((a, b) => b.date.localeCompare(a.date))

  const filtered = sorted.filter(r => {
    const typeOk = typeFilter === 'All' || r.type === typeFilter
    const pkgOk = packageFilter === 'All' || r.package === packageFilter
    const breakOk = !breakingOnly || r.breaking
    return typeOk && pkgOk && breakOk
  })

  function handleAdd() {
    if (!addVersion.trim()) return
    const nextId = releases.length > 0 ? Math.max(...releases.map(r => r.id)) + 1 : 1
    setReleases(prev => [...prev, {
      id: nextId,
      version: addVersion.trim(),
      package: addPkg,
      type: addType,
      date: TODAY,
      notes: addNotes.trim(),
      breaking: false,
    }])
    setAddVersion('')
    setAddNotes('')
  }

  function handleDelete(id: number) {
    setReleases(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div>
      <h1 data-testid="heading">Version Notes</h1>

      <div>
        <button data-testid="filter-all" onClick={() => setTypeFilter('All')}>All</button>
        {TYPES.map(t => (
          <button key={t} data-testid={`filter-${t}`} onClick={() => setTypeFilter(t)}>{t}</button>
        ))}
      </div>

      <div>
        <select
          data-testid="package-select"
          value={packageFilter}
          onChange={e => setPackageFilter(e.target.value)}
        >
          <option value="All">All</option>
          {PACKAGES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="checkbox"
          data-testid="breaking-checkbox"
          checked={breakingOnly}
          onChange={e => setBreakingOnly(e.target.checked)}
        />
        <label>Breaking only</label>
      </div>

      <div data-testid="release-count">{filtered.length} releases</div>

      <ul>
        {filtered.map(r => (
          <li key={r.id} data-testid={`release-item-${r.id}`}>
            <span data-testid={`release-version-${r.id}`}>{r.version}</span>
            <span data-testid={`release-package-${r.id}`}>{r.package}</span>
            <span data-testid={`release-type-${r.id}`}>{r.type}</span>
            <span data-testid={`release-breaking-${r.id}`}>{r.breaking ? 'Breaking' : 'Safe'}</span>
            <span>{r.notes}</span>
            <button data-testid={`delete-${r.id}`} onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div>
        <input
          data-testid="add-version"
          value={addVersion}
          onChange={e => setAddVersion(e.target.value)}
          placeholder="Version"
        />
        <select
          data-testid="add-package"
          value={addPkg}
          onChange={e => setAddPkg(e.target.value)}
        >
          {PACKAGES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          data-testid="add-type"
          value={addType}
          onChange={e => setAddType(e.target.value as ReleaseType)}
        >
          {TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          data-testid="add-notes"
          value={addNotes}
          onChange={e => setAddNotes(e.target.value)}
          placeholder="Notes"
        />
        <button data-testid="add-button" onClick={handleAdd}>Add</button>
      </div>
    </div>
  )
}
