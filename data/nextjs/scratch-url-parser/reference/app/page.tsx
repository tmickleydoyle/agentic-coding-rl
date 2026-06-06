'use client'
import { useState } from 'react'

const SEED_URL = 'https://user:pass@example.com:8080/path/to/page?foo=bar&baz=qux#section2'

interface ParsedURL {
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  params: Array<{ key: string; value: string }>
}

export default function App() {
  const [input, setInput] = useState(SEED_URL)
  const [parsed, setParsed] = useState<ParsedURL | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [show, setShow] = useState(false)

  function parse() {
    setError(null)
    try {
      const url = new URL(input.trim())
      const params: Array<{ key: string; value: string }> = []
      url.searchParams.forEach((value, key) => {
        params.push({ key, value })
      })
      setParsed({
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        params,
      })
      setShow(true)
    } catch {
      setParsed(null)
      setError('Invalid URL')
      setShow(true)
    }
  }

  function clear() {
    setInput('')
    setParsed(null)
    setError(null)
    setShow(false)
  }

  return (
    <div>
      <h1>URL Parser</h1>
      <div>
        <input
          aria-label="URL"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <button onClick={parse}>Parse</button>
      <button onClick={clear}>Clear</button>

      {show && (
        <div data-testid="results">
          {error && <p data-testid="parse-error">{error}</p>}
          {parsed && (
            <>
              <table>
                <tbody>
                  <tr><td>Protocol</td><td data-testid="parsed-protocol">{parsed.protocol}</td></tr>
                  <tr><td>Username</td><td data-testid="parsed-username">{parsed.username}</td></tr>
                  <tr><td>Password</td><td data-testid="parsed-password">{parsed.password}</td></tr>
                  <tr><td>Hostname</td><td data-testid="parsed-hostname">{parsed.hostname}</td></tr>
                  <tr><td>Port</td><td data-testid="parsed-port">{parsed.port}</td></tr>
                  <tr><td>Pathname</td><td data-testid="parsed-pathname">{parsed.pathname}</td></tr>
                  <tr><td>Search</td><td data-testid="parsed-search">{parsed.search}</td></tr>
                  <tr><td>Hash</td><td data-testid="parsed-hash">{parsed.hash}</td></tr>
                </tbody>
              </table>
              <h2>Query Parameters</h2>
              <ul>
                {parsed.params.map((p, i) => (
                  <li key={i} data-testid="param-row">{p.key}={p.value}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
