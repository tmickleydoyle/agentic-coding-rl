'use client'
import { useState } from 'react'

type Env = 'production' | 'staging'

interface Flag {
  id: number
  name: string
  enabled: boolean
  environment: Env
  description: string
}

const SEED: Flag[] = [
  { id: 1, name: 'dark-mode', enabled: true, environment: 'production', description: 'Enable dark mode UI' },
  { id: 2, name: 'new-checkout', enabled: false, environment: 'staging', description: 'Revamped checkout flow' },
  { id: 3, name: 'beta-search', enabled: true, environment: 'staging', description: 'Improved search algorithm' },
  { id: 4, name: 'analytics-v2', enabled: false, environment: 'production', description: 'New analytics pipeline' },
]

export default function App() {
  const [flags, setFlags] = useState<Flag[]>(SEED.map(f => ({ ...f })))
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [environment, setEnvironment] = useState<Env>('production')
  const [filter, setFilter] = useState<'All' | Env>('All')
  const [nextId, setNextId] = useState(5)

  function addFlag() {
    if (!name.trim()) return
    setFlags(prev => [...prev, { id: nextId, name: name.trim(), enabled: false, environment, description: description.trim() }])
    setNextId(n => n + 1)
    setName('')
    setDescription('')
    setEnvironment('production')
  }

  function toggleFlag(id: number) {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }

  function deleteFlag(id: number) {
    setFlags(prev => prev.filter(f => f.id !== id))
  }

  const countEnabled = flags.filter(f => f.enabled).length
  const countDisabled = flags.filter(f => !f.enabled).length

  const visible = filter === 'All' ? flags : flags.filter(f => f.environment === filter)

  return (
    <div>
      <h1>Feature Flags</h1>

      <div>
        <span data-testid="count-enabled">Enabled: {countEnabled}</span>
        <span data-testid="count-disabled">Disabled: {countDisabled}</span>
      </div>

      <div>
        <input
          aria-label="Flag Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          aria-label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select
          aria-label="Environment"
          value={environment}
          onChange={e => setEnvironment(e.target.value as Env)}
        >
          <option value="production">production</option>
          <option value="staging">staging</option>
        </select>
        <button onClick={addFlag}>Add Flag</button>
      </div>

      <div>
        <select
          aria-label="Filter by environment"
          value={filter}
          onChange={e => setFilter(e.target.value as 'All' | Env)}
        >
          <option value="All">All</option>
          <option value="production">production</option>
          <option value="staging">staging</option>
        </select>
      </div>

      <ul>
        {visible.map(flag => (
          <li key={flag.id} data-testid="flag-item">
            <span data-testid="flag-name">{flag.name}</span>
            <span data-testid="flag-status">{flag.enabled ? 'Enabled' : 'Disabled'}</span>
            <span data-testid="flag-env">{flag.environment}</span>
            <span data-testid="flag-description">{flag.description}</span>
            <button onClick={() => toggleFlag(flag.id)}>Toggle</button>
            <button onClick={() => deleteFlag(flag.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
