'use client'
import { useState } from 'react'

export default function App() {
  const [csvInput, setCsvInput] = useState('')
  const [search, setSearch] = useState('')

  return (
    <div>
      <h1>CSV Viewer</h1>
      <textarea
        aria-label="CSV Input"
        value={csvInput}
        onChange={e => setCsvInput(e.target.value)}
      />
      <button>Parse</button>
      <p data-testid="status"></p>
      <input
        aria-label="Search"
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table>
        <thead><tr></tr></thead>
        <tbody></tbody>
      </table>
      <button>Download CSV</button>
    </div>
  )
}
