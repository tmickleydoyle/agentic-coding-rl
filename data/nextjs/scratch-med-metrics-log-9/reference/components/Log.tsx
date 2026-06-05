'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { getTrend } from '../lib/trend'

export function Log() {
  const { entries, addEntry, clearAll, showTrend } = useApp()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  // Compute latest entry id per metric name
  const latestIdByName: Record<string, number> = {}
  entries.forEach((e) => {
    latestIdByName[e.name] = e.id
  })

  // For trend, build per-name ordered list of values
  const valuesByName: Record<string, number[]> = {}
  entries.forEach((e) => {
    if (!valuesByName[e.name]) valuesByName[e.name] = []
    valuesByName[e.name].push(e.value)
  })

  const displayed = entries.slice().reverse()

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
        {displayed.map((e) => {
          const isLatest = latestIdByName[e.name] === e.id
          const vals = valuesByName[e.name]
          const trend = isLatest ? getTrend(vals) : null
          return (
            <li key={e.id}>
              <span>{`${e.name}: ${e.value}`}</span>
              {showTrend && isLatest && trend !== null && (
                <span>{trend}</span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
