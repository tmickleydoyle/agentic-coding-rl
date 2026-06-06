'use client'
import { useState, useEffect } from 'react'

const SEED_CSV = `Name,Age,City,Score
Alice,30,New York,95
Bob,25,London,87
Charlie,35,Paris,92
Diana,28,Tokyo,88
Eve,32,Sydney,91`

interface ParseResult {
  headers: string[]
  rows: string[][]
}

function parseCSV(text: string): ParseResult | null {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length === 0) return null
  const headers = lines[0].split(',')
  const rows = lines.slice(1).map(l => l.split(','))
  return { headers, rows }
}

export default function App() {
  const [csvInput, setCsvInput] = useState(SEED_CSV)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<string[][]>([])
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState<number | null>(null)
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    runParse(SEED_CSV)
  }, [])

  function runParse(text: string) {
    if (!text.trim()) {
      setHeaders([])
      setRows([])
      setStatus('No data')
      setSortCol(null)
      setSortAsc(true)
      return
    }
    const result = parseCSV(text)
    if (!result) {
      setStatus('Parse error')
      return
    }
    setHeaders(result.headers)
    setRows(result.rows)
    setStatus(`${result.rows.length} rows, ${result.headers.length} columns`)
    setSortCol(null)
    setSortAsc(true)
  }

  function handleParse() {
    runParse(csvInput)
  }

  function handleSort(colIdx: number) {
    if (sortCol === colIdx) {
      setSortAsc(a => !a)
    } else {
      setSortCol(colIdx)
      setSortAsc(true)
    }
  }

  const filteredRows = rows.filter(row =>
    !search || row.some(cell => cell.toLowerCase().includes(search.toLowerCase()))
  )

  const sortedRows = sortCol !== null
    ? [...filteredRows].sort((a, b) => {
        const av = (a[sortCol] ?? '').toLowerCase()
        const bv = (b[sortCol] ?? '').toLowerCase()
        if (av < bv) return sortAsc ? -1 : 1
        if (av > bv) return sortAsc ? 1 : -1
        return 0
      })
    : filteredRows

  function handleDownload() {
    const allRows = [headers, ...sortedRows]
    const csvStr = allRows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csvStr], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h1>CSV Viewer</h1>

      <label>
        CSV Input
        <textarea
          aria-label="CSV Input"
          value={csvInput}
          onChange={e => setCsvInput(e.target.value)}
        />
      </label>

      <button onClick={handleParse}>Parse</button>

      <p data-testid="status">{status}</p>

      <label>
        Search
        <input
          aria-label="Search"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </label>

      {headers.length > 0 && (
        <table>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  data-testid="col-header"
                  onClick={() => handleSort(i)}
                  style={{ cursor: 'pointer' }}
                >
                  {h}
                  {sortCol === i && (
                    <span data-testid="sort-indicator">{sortAsc ? '▲' : '▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, ri) => (
              <tr key={ri} data-testid="row">
                {row.map((cell, ci) => (
                  <td key={ci} data-testid="cell">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={handleDownload}>Download CSV</button>
    </div>
  )
}
