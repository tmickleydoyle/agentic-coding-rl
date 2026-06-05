'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { getLatestPerMetric } from '../lib/metrics'

export function LogView() {
  const { entries, addEntry, deleteMetric } = useApp()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  const rows = getLatestPerMetric(entries)
  const distinctCount = rows.length

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
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Latest Value</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.latestValue}</td>
              <td>{row.trend}</td>
              <td>
                <button
                  aria-label={`Delete ${row.name}`}
                  onClick={() => deleteMetric(row.name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{`Metrics tracked: ${distinctCount}`}</p>
    </section>
  )
}
