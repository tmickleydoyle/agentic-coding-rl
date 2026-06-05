'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { FilterOption } from '../lib/types'

export function Experiments() {
  const { experiments, filter, addExperiment, markDone, setFilter } = useApp()
  const [name, setName] = useState('')
  const [pendingId, setPendingId] = useState<number | null>(null)

  const filtered = experiments.filter((e) => {
    if (filter === 'Running') return e.status === 'running'
    if (filter === 'Done') return e.status === 'done'
    return true
  })

  const OPTIONS: FilterOption[] = ['All', 'Running', 'Done']

  return (
    <section aria-label="Experiments view">
      <h1>{`Experiments (${filtered.length})`}</h1>
      <div>
        <input
          aria-label="Experiment name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={() => {
            addExperiment(name)
            setName('')
          }}
        >
          Add experiment
        </button>
      </div>
      <div>
        <label htmlFor="exp-filter">Filter</label>
        <select
          id="exp-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
        >
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filtered.map((exp) => (
          <li key={exp.id}>
            <span>{exp.name}</span>
            <span>{exp.status}</span>
            {exp.status === 'done' && exp.winner && <span>{`Winner: ${exp.winner}`}</span>}
            {exp.status === 'running' && pendingId !== exp.id && (
              <button onClick={() => setPendingId(exp.id)}>Mark done</button>
            )}
            {exp.status === 'running' && pendingId === exp.id && (
              <>
                <button
                  onClick={() => {
                    markDone(exp.id, 'A')
                    setPendingId(null)
                  }}
                >
                  Winner: A
                </button>
                <button
                  onClick={() => {
                    markDone(exp.id, 'B')
                    setPendingId(null)
                  }}
                >
                  Winner: B
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
