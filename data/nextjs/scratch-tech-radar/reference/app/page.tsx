'use client'
import { useState } from 'react'

type Status = 'Adopt' | 'Trial' | 'Assess' | 'Hold'
type Category = 'Languages' | 'Protocols' | 'Runtimes' | 'Frameworks'

interface Tech {
  id: number
  name: string
  category: Category
  status: Status
  description: string
}

const SEED: Tech[] = [
  { id: 1, name: 'TypeScript', category: 'Languages', status: 'Adopt', description: 'Strongly typed JS superset' },
  { id: 2, name: 'GraphQL', category: 'Protocols', status: 'Trial', description: 'Query language for APIs' },
  { id: 3, name: 'Deno', category: 'Runtimes', status: 'Assess', description: 'Secure JS/TS runtime' },
  { id: 4, name: 'CoffeeScript', category: 'Languages', status: 'Hold', description: 'JS transpiler language' },
  { id: 5, name: 'React', category: 'Frameworks', status: 'Adopt', description: 'UI component library' },
  { id: 6, name: 'Svelte', category: 'Frameworks', status: 'Trial', description: 'Compile-time UI framework' },
  { id: 7, name: 'Bun', category: 'Runtimes', status: 'Assess', description: 'Fast JS runtime & toolkit' },
  { id: 8, name: 'REST', category: 'Protocols', status: 'Adopt', description: 'Stateless HTTP architecture' },
]

const STATUSES: Status[] = ['Adopt', 'Trial', 'Assess', 'Hold']
const CATEGORIES: Category[] = ['Languages', 'Protocols', 'Runtimes', 'Frameworks']

export default function App() {
  const [techs, setTechs] = useState<Tech[]>(SEED.map(t => ({ ...t })))
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All')
  const [addName, setAddName] = useState('')
  const [addCategory, setAddCategory] = useState<Category>('Languages')
  const [addStatus, setAddStatus] = useState<Status>('Adopt')

  const filtered = techs.filter(t => {
    const statusOk = statusFilter === 'All' || t.status === statusFilter
    const catOk = categoryFilter === 'All' || t.category === categoryFilter
    return statusOk && catOk
  })

  function handleAdd() {
    if (!addName.trim()) return
    const nextId = techs.length > 0 ? Math.max(...techs.map(t => t.id)) + 1 : 1
    setTechs(prev => [...prev, { id: nextId, name: addName.trim(), category: addCategory, status: addStatus, description: '' }])
    setAddName('')
  }

  function handleRemove(id: number) {
    setTechs(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div>
      <h1 data-testid="heading">Tech Radar</h1>

      <div>
        <button data-testid="filter-all" onClick={() => setStatusFilter('All')}>All</button>
        {STATUSES.map(s => (
          <button key={s} data-testid={`filter-${s.toLowerCase()}`} onClick={() => setStatusFilter(s)}>{s}</button>
        ))}
      </div>

      <div>
        <select
          data-testid="category-select"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as Category | 'All')}
        >
          <option value="All">All</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div data-testid="tech-count">{filtered.length} technologies</div>

      <ul>
        {filtered.map(t => (
          <li key={t.id} data-testid={`tech-item-${t.id}`}>
            <span data-testid={`tech-name-${t.id}`}>{t.name}</span>
            <span data-testid={`tech-status-${t.id}`}>{t.status}</span>
            <span data-testid={`tech-category-${t.id}`}>{t.category}</span>
            <span>{t.description}</span>
            <button data-testid={`remove-${t.id}`} onClick={() => handleRemove(t.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <div>
        <input
          data-testid="add-name"
          value={addName}
          onChange={e => setAddName(e.target.value)}
          placeholder="Technology name"
        />
        <select
          data-testid="add-category"
          value={addCategory}
          onChange={e => setAddCategory(e.target.value as Category)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          data-testid="add-status"
          value={addStatus}
          onChange={e => setAddStatus(e.target.value as Status)}
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button data-testid="add-button" onClick={handleAdd}>Add</button>
      </div>
    </div>
  )
}
