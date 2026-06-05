'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { getTrend } from '../lib/utils'

export function Log() {
  const { entries, addEntry, clearAll, decimals } = useApp()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = filter
    ? entries.filter((e) => e.name.toLowerCase().includes(filter.toLowerCase()))
    : entries

  return (
    <section aria-label="Log view">
      <h1>Log</h1>
      <div>
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
      </div>
      <div>
        <input
          aria-label="Filter by metric"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by metric"
        />
      </div>
      <button onClick={clearAll}>Clear all</button>
      <ul>
        {filtered.map((entry) => {
          const trend = getTrend(entries, entry)
          return (
            <li key={entry.id}>
              {`#${entry.order} ${entry.name}: ${entry.value.toFixed(decimals)} ${trend}`}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
