'use client'
import { useState } from 'react'

const METHODS = ['GET', 'POST', 'PUT', 'DELETE']

interface Route {
  id: number
  method: string
  path: string
  status: number
  body: string
}

const SEED_ROUTES: Route[] = [
  { id: 1, method: 'GET', path: '/api/users', status: 200, body: '{"users": []}' },
  { id: 2, method: 'POST', path: '/api/users', status: 201, body: '{"created": true}' },
  { id: 3, method: 'GET', path: '/api/health', status: 200, body: '{"status": "ok"}' },
]

export default function App() {
  const [routes] = useState<Route[]>(SEED_ROUTES.map(r => ({ ...r })))
  const [addPath, setAddPath] = useState('')

  return (
    <div>
      <h1>API Mocker</h1>
      <p data-testid="route-count">Routes: {routes.length}</p>

      <section>
        <select aria-label="Method">
          {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input aria-label="Path" value={addPath} onChange={e => setAddPath(e.target.value)} />
        <input aria-label="Status code" type="number" />
        <input aria-label="Response body" />
        <button>Add Route</button>
      </section>

      <ul>
        {routes.map(r => (
          <li key={r.id} data-testid="route-row">
            {r.method} {r.path} → {r.status} {r.body}
            <button>Delete</button>
          </li>
        ))}
      </ul>

      <section>
        <select aria-label="Request method">
          {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input aria-label="Request path" />
        <button>Send Request</button>
      </section>

      <p data-testid="response-status"></p>
      <p data-testid="response-body"></p>
    </div>
  )
}
