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
  const [routes, setRoutes] = useState<Route[]>(SEED_ROUTES.map(r => ({ ...r })))
  const [nextId, setNextId] = useState(4)

  const [addMethod, setAddMethod] = useState('GET')
  const [addPath, setAddPath] = useState('')
  const [addStatus, setAddStatus] = useState('')
  const [addBody, setAddBody] = useState('')

  const [reqMethod, setReqMethod] = useState('GET')
  const [reqPath, setReqPath] = useState('')
  const [resStatus, setResStatus] = useState('')
  const [resBody, setResBody] = useState('')

  function handleAddRoute() {
    if (!addPath.trim()) return
    const sc = parseInt(addStatus, 10)
    if (!isFinite(sc) || sc <= 0) return
    setRoutes(rs => [...rs, { id: nextId, method: addMethod, path: addPath.trim(), status: sc, body: addBody }])
    setNextId(n => n + 1)
    setAddPath('')
    setAddStatus('')
    setAddBody('')
  }

  function handleDelete(id: number) {
    setRoutes(rs => rs.filter(r => r.id !== id))
  }

  function handleSend() {
    const match = routes.find(r => r.method === reqMethod && r.path === reqPath)
    if (match) {
      setResStatus(`Status: ${match.status}`)
      setResBody(match.body)
    } else {
      setResStatus('Status: 404')
      setResBody('{"error": "Not found"}')
    }
  }

  return (
    <div>
      <h1>API Mocker</h1>
      <p data-testid="route-count">Routes: {routes.length}</p>

      <section>
        <select aria-label="Method" value={addMethod} onChange={e => setAddMethod(e.target.value)}>
          {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input aria-label="Path" value={addPath} onChange={e => setAddPath(e.target.value)} />
        <input aria-label="Status code" type="number" value={addStatus} onChange={e => setAddStatus(e.target.value)} />
        <input aria-label="Response body" value={addBody} onChange={e => setAddBody(e.target.value)} />
        <button onClick={handleAddRoute}>Add Route</button>
      </section>

      <ul>
        {routes.map(r => (
          <li key={r.id} data-testid="route-row">
            {r.method} {r.path} → {r.status} {r.body}
            <button onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <section>
        <select aria-label="Request method" value={reqMethod} onChange={e => setReqMethod(e.target.value)}>
          {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input aria-label="Request path" value={reqPath} onChange={e => setReqPath(e.target.value)} />
        <button onClick={handleSend}>Send Request</button>
      </section>

      <p data-testid="response-status">{resStatus}</p>
      <p data-testid="response-body">{resBody}</p>
    </div>
  )
}
