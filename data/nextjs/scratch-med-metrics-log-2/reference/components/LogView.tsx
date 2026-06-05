'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { latestPerMetric } from '../lib/utils'

export function LogView() {
  const { entries, addEntry, clearAll, showAll } = useApp()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  const displayed = showAll ? entries : latestPerMetric(entries)

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
        {displayed.map((e) => (
          <li key={e.index}>{`#${e.index} — ${e.name}: ${e.value}`}</li>
        ))}
      </ul>
    </section>
  )
}
