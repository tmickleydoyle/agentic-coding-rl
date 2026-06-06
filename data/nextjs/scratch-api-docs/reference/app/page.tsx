'use client'
import { useState } from 'react'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface Endpoint {
  id: number
  method: Method
  path: string
  description: string
  tag: string
  deprecated: boolean
}

const SEED: Endpoint[] = [
  { id: 1, method: 'GET', path: '/api/users', description: 'List all users', tag: 'Users', deprecated: false },
  { id: 2, method: 'POST', path: '/api/users', description: 'Create a new user', tag: 'Users', deprecated: false },
  { id: 3, method: 'GET', path: '/api/posts', description: 'List all posts', tag: 'Posts', deprecated: false },
  { id: 4, method: 'DELETE', path: '/api/posts/:id', description: 'Delete a post by ID', tag: 'Posts', deprecated: true },
]

export default function App() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(SEED.map(e => ({ ...e })))
  const [method, setMethod] = useState<Method>('GET')
  const [path, setPath] = useState('')
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState('')
  const [deprecated, setDeprecated] = useState(false)
  const [filterTag, setFilterTag] = useState('All')
  const [filterMethod, setFilterMethod] = useState<'All' | Method>('All')
  const [nextId, setNextId] = useState(5)

  function addEndpoint() {
    if (!path.trim()) return
    setEndpoints(prev => [...prev, { id: nextId, method, path: path.trim(), description: description.trim(), tag: tag.trim(), deprecated }])
    setNextId(n => n + 1)
    setMethod('GET')
    setPath('')
    setDescription('')
    setTag('')
    setDeprecated(false)
  }

  function deleteEndpoint(id: number) {
    setEndpoints(prev => prev.filter(e => e.id !== id))
  }

  const allTags = Array.from(new Set(endpoints.map(e => e.tag).filter(Boolean)))

  const visible = endpoints.filter(e => {
    const tagMatch = filterTag === 'All' || e.tag === filterTag
    const methodMatch = filterMethod === 'All' || e.method === filterMethod
    return tagMatch && methodMatch
  })

  const countTotal = endpoints.length
  const countDeprecated = endpoints.filter(e => e.deprecated).length

  return (
    <div>
      <h1>API Docs</h1>

      <div>
        <span data-testid="count-total">Total: {countTotal}</span>
        <span data-testid="count-deprecated">Deprecated: {countDeprecated}</span>
      </div>

      <div>
        <select
          aria-label="Method"
          value={method}
          onChange={e => setMethod(e.target.value as Method)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          aria-label="Path"
          value={path}
          onChange={e => setPath(e.target.value)}
        />
        <input
          aria-label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          aria-label="Tag"
          value={tag}
          onChange={e => setTag(e.target.value)}
        />
        <input
          type="checkbox"
          aria-label="Deprecated"
          checked={deprecated}
          onChange={e => setDeprecated(e.target.checked)}
        />
        <button onClick={addEndpoint}>Add Endpoint</button>
      </div>

      <div>
        <select
          aria-label="Filter by tag"
          value={filterTag}
          onChange={e => setFilterTag(e.target.value)}
        >
          <option value="All">All</option>
          {allTags.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          aria-label="Filter by method"
          value={filterMethod}
          onChange={e => setFilterMethod(e.target.value as 'All' | Method)}
        >
          <option value="All">All</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <ul>
        {visible.map(ep => (
          <li key={ep.id} data-testid="endpoint-item">
            <span data-testid="endpoint-method">{ep.method}</span>
            <span data-testid="endpoint-path">{ep.path}</span>
            <span data-testid="endpoint-description">{ep.description}</span>
            <span data-testid="endpoint-tag">{ep.tag}</span>
            <span data-testid="endpoint-deprecated">{ep.deprecated ? 'Yes' : 'No'}</span>
            <button onClick={() => deleteEndpoint(ep.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
