'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { getTrend } from '../lib/trend'

export function Log() {
  const { entries, addEntry, clearAll, filterLow } = useApp()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  const displayed = filterLow ? entries.filter((e) => e.value >= 10) : entries

  return (
    <section aria-label="Log view">
      <h1>Log</h1>
      <input
        aria-label="Metric name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="Metric value"
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
      {entries.length > 0 && (
        <button onClick={clearAll}>Clear all</button>
      )}
      <ul>
        {displayed.map((entry, idx) => {
          // Global index for display (#N) is 1-based position in original entries array
          const globalIndex = entries.indexOf(entry) + 1
          const trend = getTrend(entries, entry)
          return (
            <li key={entry.id}>
              {`#${globalIndex} ${entry.name}: ${entry.value}`}
              <span aria-label="trend">{` ${trend}`}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
