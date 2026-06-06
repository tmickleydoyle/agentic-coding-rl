'use client'
import { useState } from 'react'

type ChangeType = 'major' | 'minor' | 'patch'

interface Entry {
  id: number
  version: string
  date: string
  type: ChangeType
  summary: string
}

const SEED: Entry[] = [
  { id: 1, version: '1.0.0', date: '2024-01-15', type: 'major', summary: 'Initial public release' },
  { id: 2, version: '1.1.0', date: '2024-02-20', type: 'minor', summary: 'Added dark mode support' },
  { id: 3, version: '1.1.1', date: '2024-03-05', type: 'patch', summary: 'Fixed login redirect bug' },
  { id: 4, version: '1.2.0', date: '2024-04-10', type: 'minor', summary: 'New dashboard widgets' },
]

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(SEED.map(e => ({ ...e })))
  const [version, setVersion] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<ChangeType>('minor')
  const [summary, setSummary] = useState('')
  const [filter, setFilter] = useState<'All' | ChangeType>('All')
  const [nextId, setNextId] = useState(5)

  function addEntry() {
    if (!version.trim()) return
    setEntries(prev => [...prev, { id: nextId, version: version.trim(), date: date.trim(), type, summary: summary.trim() }])
    setNextId(n => n + 1)
    setVersion('')
    setDate('')
    setType('minor')
    setSummary('')
  }

  function deleteEntry(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const countMajor = entries.filter(e => e.type === 'major').length
  const countMinor = entries.filter(e => e.type === 'minor').length
  const countPatch = entries.filter(e => e.type === 'patch').length

  const filtered = filter === 'All' ? entries : entries.filter(e => e.type === filter)
  const visible = [...filtered].reverse()

  return (
    <div>
      <h1>Changelog</h1>

      <div>
        <span data-testid="count-major">Major: {countMajor}</span>
        <span data-testid="count-minor">Minor: {countMinor}</span>
        <span data-testid="count-patch">Patch: {countPatch}</span>
      </div>

      <div>
        <input
          aria-label="Version"
          value={version}
          onChange={e => setVersion(e.target.value)}
        />
        <input
          aria-label="Date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <select
          aria-label="Type"
          value={type}
          onChange={e => setType(e.target.value as ChangeType)}
        >
          <option value="major">major</option>
          <option value="minor">minor</option>
          <option value="patch">patch</option>
        </select>
        <input
          aria-label="Summary"
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />
        <button onClick={addEntry}>Add Entry</button>
      </div>

      <div>
        <select
          aria-label="Filter by type"
          value={filter}
          onChange={e => setFilter(e.target.value as 'All' | ChangeType)}
        >
          <option value="All">All</option>
          <option value="major">major</option>
          <option value="minor">minor</option>
          <option value="patch">patch</option>
        </select>
      </div>

      <ul>
        {visible.map(entry => (
          <li key={entry.id} data-testid="entry-item">
            <span data-testid="entry-version">{entry.version}</span>
            <span data-testid="entry-date">{entry.date}</span>
            <span data-testid="entry-type">{entry.type}</span>
            <span data-testid="entry-summary">{entry.summary}</span>
            <button onClick={() => deleteEntry(entry.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
