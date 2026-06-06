'use client'
import { useState } from 'react'

interface StatusCode {
  code: number
  name: string
  description: string
  category: string
}

const STATUS_CODES: StatusCode[] = [
  { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed.', category: '1xx' },
  { code: 101, name: 'Switching Protocols', description: 'The server is switching protocols as requested by the client.', category: '1xx' },
  { code: 200, name: 'OK', description: 'The request has succeeded.', category: '2xx' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled and a new resource has been created.', category: '2xx' },
  { code: 204, name: 'No Content', description: 'The server has fulfilled the request but does not need to return a body.', category: '2xx' },
  { code: 206, name: 'Partial Content', description: 'The server is delivering only part of the resource.', category: '2xx' },
  { code: 301, name: 'Moved Permanently', description: 'The requested resource has been permanently moved to a new URL.', category: '3xx' },
  { code: 302, name: 'Found', description: 'The resource is temporarily located at a different URL.', category: '3xx' },
  { code: 304, name: 'Not Modified', description: 'The resource has not been modified since the last request.', category: '3xx' },
  { code: 307, name: 'Temporary Redirect', description: 'The resource is temporarily at another URI, method must not change.', category: '3xx' },
  { code: 308, name: 'Permanent Redirect', description: 'The resource has permanently moved and the method must not change.', category: '3xx' },
  { code: 400, name: 'Bad Request', description: 'The server cannot process the request due to a client error.', category: '4xx' },
  { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or not been provided.', category: '4xx' },
  { code: 403, name: 'Forbidden', description: 'The server refuses to authorize the request.', category: '4xx' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found.', category: '4xx' },
  { code: 405, name: 'Method Not Allowed', description: 'The request method is not supported for this resource.', category: '4xx' },
  { code: 409, name: 'Conflict', description: 'The request conflicts with the current state of the resource.', category: '4xx' },
  { code: 410, name: 'Gone', description: 'The resource is no longer available and will not be available again.', category: '4xx' },
  { code: 422, name: 'Unprocessable Entity', description: 'The request was well-formed but contains semantic errors.', category: '4xx' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time.', category: '4xx' },
  { code: 500, name: 'Internal Server Error', description: 'The server encountered an unexpected condition.', category: '5xx' },
  { code: 501, name: 'Not Implemented', description: 'The server does not support the functionality required.', category: '5xx' },
  { code: 502, name: 'Bad Gateway', description: 'The server received an invalid response from an upstream server.', category: '5xx' },
  { code: 503, name: 'Service Unavailable', description: 'The server is currently unable to handle the request.', category: '5xx' },
  { code: 504, name: 'Gateway Timeout', description: 'The upstream server did not respond in time.', category: '5xx' },
]

const CATEGORIES = ['All', '1xx', '2xx', '3xx', '4xx', '5xx']

export default function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedCode, setExpandedCode] = useState<number | null>(null)

  const lower = search.toLowerCase()
  const filtered = STATUS_CODES.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory
    const matchesSearch = !search ||
      String(s.code).includes(lower) ||
      s.name.toLowerCase().includes(lower)
    return matchesCategory && matchesSearch
  })

  function toggleExpand(code: number) {
    setExpandedCode(prev => prev === code ? null : code)
  }

  return (
    <div>
      <h1>HTTP Status Codes</h1>

      <label>
        Search codes
        <input value={search} onChange={e => setSearch(e.target.value)} />
      </label>

      <div>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            data-testid={`filter-${cat}`}
            aria-pressed={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p data-testid="result-count">{filtered.length} results</p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map(s => (
          <li key={s.code} data-testid="status-item" style={{ marginBottom: '0.5rem' }}>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => toggleExpand(s.code)}
            >
              <span data-testid={`code-${s.code}`}>{s.code}</span>
              {' '}
              <span data-testid={`name-${s.code}`}>{s.name}</span>
              {' '}
              <span data-testid={`category-${s.code}`}>{s.category}</span>
            </div>
            {expandedCode === s.code && (
              <p data-testid={`desc-${s.code}`}>{s.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
