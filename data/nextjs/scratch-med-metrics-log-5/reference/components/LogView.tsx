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
      <ul>
        {entries.map((entry, idx) => {
          const prior = entries.slice(0, idx).filter((e) => e.name === entry.name)
          const trend = getTrend(prior.length > 0 ? prior[prior.length - 1].value : null, entry.value)
          return (
            <li key={entry.id}>
              <span>{entry.name}</span>
              <span>{entry.value}</span>
              <span>{trend}</span>
              <button aria-label={`Delete ${entry.name} ${entry.id}`} onClick={() => deleteEntry(entry.id)}>
                Delete
              </button>
            </li>
          )
        })}
      </ul>
      <p>{`Entries: ${entries.length}`}</p>
    </section>
  )
}
