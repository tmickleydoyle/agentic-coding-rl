'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function LogView() {
  const { entries, addEntry, deleteEntry } = useApp()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

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
      <h2>{`Entries (${entries.length})`}</h2>
      <ul>
        {entries.map((e, idx) => (
          <li key={e.id}>
            <span>{`#${idx + 1} ${e.name}: ${e.value.toFixed(2)}`}</span>
            <button aria-label={`Delete entry ${idx + 1}`} onClick={() => deleteEntry(e.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
