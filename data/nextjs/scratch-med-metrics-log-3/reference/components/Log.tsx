'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { getTrend } from '../lib/trend'

export function Log() {
  const { entries, addEntry, clearAll } = useApp()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  // For each entry, determine if it's the latest for its metric name
  // and compute trend vs previous entry for that name
  function trendForEntry(index: number): string | null {
    const entry = entries[index]
    // Find all entries with this name up to and including this index
    const same = entries.slice(0, index + 1).filter((e) => e.name === entry.name)
    // Is this the latest among ALL entries for this name?
    const lastIdx = entries.reduce((acc, e, i) => (e.name === entry.name ? i : acc), -1)
    if (lastIdx !== index) return null // not the latest
    if (same.length < 2) return null // no previous
    const prev = same[same.length - 2]
    return getTrend(entry.value, prev.value)
  }

  return (
    <section aria-label="Log view">
      <h1>Log</h1>
      <input
        aria-label="Metric name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => {
          addEntry(name, value)
          setName('')
          setValue('')
        }}
      >
        Add entry
      </button>
      <button onClick={clearAll}>Clear all</button>
      <ul>
        {entries.map((entry, idx) => {
          const trend = trendForEntry(idx)
          return (
            <li key={entry.id}>
              {trend !== null
                ? `${entry.name}: ${entry.value} ${trend}`
                : `${entry.name}: ${entry.value}`}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
