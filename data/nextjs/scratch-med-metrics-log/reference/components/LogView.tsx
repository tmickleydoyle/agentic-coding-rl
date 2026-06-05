'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { getTrend } from '../lib/trend'

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
      <p>{`Entries: ${entries.length}`}</p>
      <ul>
        {entries.map((entry, idx) => {
          const trend = getTrend(entries, idx)
          return (
            <li key={entry.id}>
              <span>{entry.name}</span>
              <span>{entry.value}</span>
              {trend !== '' && <span aria-label="trend">{trend}</span>}
              <button
                aria-label={`Delete ${entry.name} ${entry.value}`}
                onClick={() => deleteEntry(entry.id)}
              >
                Delete
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
