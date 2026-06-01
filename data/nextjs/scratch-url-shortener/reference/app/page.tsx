'use client'
import { useState } from 'react'

type Entry = {
  id: number
  shortCode: string
  originalUrl: string
  clicks: number
  copied: boolean
}

export default function App() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [nextId, setNextId] = useState(1)

  function shorten() {
    const trimmed = input.trim()
    if (!trimmed) return
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setError('Invalid URL: must start with http:// or https://')
      return
    }
    setError('')
    setEntries((es) => [
      ...es,
      {
        id: nextId,
        shortCode: `short-${nextId}`,
        originalUrl: trimmed,
        clicks: 0,
        copied: false,
      },
    ])
    setNextId((n) => n + 1)
    setInput('')
  }

  function visit(id: number) {
    setEntries((es) =>
      es.map((e) => (e.id === id ? { ...e, clicks: e.clicks + 1 } : e))
    )
  }

  function copy(id: number) {
    setEntries((es) =>
      es.map((e) => (e.id === id ? { ...e, copied: true } : e))
    )
  }

  return (
    <div>
      <h1>URL Shortener</h1>
      <div>
        <label htmlFor="long-url">Long URL</label>
        <input
          id="long-url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/very/long/path"
        />
        <button onClick={shorten}>Shorten</button>
      </div>
      {error && <p role="alert">{error}</p>}
      {entries.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Short Link</th>
              <th>Original URL</th>
              <th>Clicks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>{e.shortCode}</td>
                <td>{e.originalUrl}</td>
                <td>{e.clicks}</td>
                <td>
                  <button onClick={() => visit(e.id)}>Visit</button>
                  <button onClick={() => copy(e.id)}>
                    {e.copied ? 'Copied!' : 'Copy'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
