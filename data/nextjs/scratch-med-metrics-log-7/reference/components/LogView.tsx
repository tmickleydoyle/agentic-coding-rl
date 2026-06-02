'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { getTrend, getLatestPerMetric } from '../lib/utils'

export function LogView() {
  const { entries, addEntry, clearAll, showAll } = useApp()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  const latestIds = getLatestPerMetric(entries)
  const displayed = showAll
    ? [...entries].sort((a, b) => b.order - a.order)
    : [...entries]
        .filter((e) => latestIds.has(e.id))
        .sort((a, b) => b.order - a.order)

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
          const trend = getTrend(entries, e)
          return (
            <li key={e.id}>
              <span>{`${e.name}`}</span>
              <span>{`${e.value}`}</span>
              <span>{`#${e.order}`}</span>
              <span>{trend}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
