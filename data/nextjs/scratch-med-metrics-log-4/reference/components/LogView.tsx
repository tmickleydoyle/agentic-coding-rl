'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { computeTrend } from '../lib/computeTrend'

export function LogView() {
  const { entries, addEntry, clearAll, showTrend } = useApp()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  function handleAdd() {
    addEntry(name, value)
    setName('')
    setValue('')
  }

  const trendMap = computeTrend(entries)

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
        <button onClick={handleAdd}>Add entry</button>
      </div>
      <button onClick={clearAll}>Clear all</button>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>#</th>
            <th>Value</th>
            {showTrend && <th>Trend</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const trend = trendMap.get(entry.seq)
            return (
              <tr key={entry.seq}>
                <td>{entry.name}</td>
                <td>{entry.seq}</td>
                <td>{entry.value}</td>
                {showTrend && <td>{trend !== undefined ? trend : ''}</td>}
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
