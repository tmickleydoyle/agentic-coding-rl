'use client'
import { useState } from 'react'

interface AsciiEntry {
  dec: number
  hex: string
  char: string
  description: string
}

function getDescription(code: number): string {
  if (code === 32) return 'Space'
  if (code === 33) return 'Exclamation mark'
  if (code === 34) return 'Double quote'
  if (code === 35) return 'Hash'
  if (code === 36) return 'Dollar sign'
  if (code === 37) return 'Percent'
  if (code === 38) return 'Ampersand'
  if (code === 39) return 'Single quote'
  if (code === 40) return 'Left parenthesis'
  if (code === 41) return 'Right parenthesis'
  if (code === 42) return 'Asterisk'
  if (code === 43) return 'Plus'
  if (code === 44) return 'Comma'
  if (code === 45) return 'Hyphen'
  if (code === 46) return 'Period'
  if (code === 47) return 'Slash'
  if (code >= 48 && code <= 57) return `Digit ${code - 48}`
  if (code === 58) return 'Colon'
  if (code === 59) return 'Semicolon'
  if (code === 60) return 'Less than'
  if (code === 61) return 'Equals'
  if (code === 62) return 'Greater than'
  if (code === 63) return 'Question mark'
  if (code === 64) return 'At sign'
  if (code >= 65 && code <= 90) return `Letter ${String.fromCharCode(code)}`
  if (code === 91) return 'Left bracket'
  if (code === 92) return 'Backslash'
  if (code === 93) return 'Right bracket'
  if (code === 94) return 'Caret'
  if (code === 95) return 'Underscore'
  if (code === 96) return 'Backtick'
  if (code >= 97 && code <= 122) return `Letter ${String.fromCharCode(code)}`
  if (code === 123) return 'Left brace'
  if (code === 124) return 'Pipe'
  if (code === 125) return 'Right brace'
  if (code === 126) return 'Tilde'
  return ''
}

const ALL_ENTRIES: AsciiEntry[] = []
for (let i = 32; i <= 126; i++) {
  ALL_ENTRIES.push({
    dec: i,
    hex: i.toString(16).toUpperCase().padStart(2, '0'),
    char: i === 32 ? '(space)' : String.fromCharCode(i),
    description: getDescription(i),
  })
}

export default function App() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AsciiEntry | null>(null)

  const lower = search.toLowerCase()
  const filtered = search
    ? ALL_ENTRIES.filter(e =>
        String(e.dec).includes(lower) ||
        e.hex.toLowerCase().includes(lower) ||
        e.char.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower)
      )
    : ALL_ENTRIES

  return (
    <div>
      <h1>ASCII Table</h1>

      <label>
        Search
        <input value={search} onChange={e => setSearch(e.target.value)} />
      </label>

      <p data-testid="result-count">Showing {filtered.length} characters</p>

      <table>
        <thead>
          <tr>
            <th>Dec</th>
            <th>Hex</th>
            <th>Char</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(e => (
            <tr
              key={e.dec}
              data-testid="ascii-row"
              onClick={() => setSelected(e)}
              style={{ cursor: 'pointer', background: selected?.dec === e.dec ? '#eef' : undefined }}
            >
              <td data-testid={`dec-${e.dec}`}>{e.dec}</td>
              <td data-testid={`hex-${e.dec}`}>{e.hex}</td>
              <td data-testid={`char-${e.dec}`}>{e.char}</td>
              <td>{e.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div>
          <h2>Detail</h2>
          <p>Dec: <span data-testid="detail-dec">{selected.dec}</span></p>
          <p>Hex: <span data-testid="detail-hex">{selected.hex}</span></p>
          <p>Char: <span data-testid="detail-char">{selected.char}</span></p>
          <p>Description: <span data-testid="detail-desc">{selected.description}</span></p>
        </div>
      )}
    </div>
  )
}
