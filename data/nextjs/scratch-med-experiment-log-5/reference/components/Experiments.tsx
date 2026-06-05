'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Filter } from '../lib/types'

const FILTER_OPTIONS: Filter[] = ['All', 'Running', 'Done']

export function Experiments() {
  const { experiments, filter, addExperiment, startMarkDone, setWinner, setFilter } = useApp()
  const [name, setName] = useState('')

  const visible = experiments.filter((e) => {
    if (filter === 'Running') return e.status === 'running'
    if (filter === 'Done') return e.status === 'done'
    return true
  })

  return (
    <section aria-label="Experiments view">
      <h1>{`Experiments (${visible.length})`}</h1>
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
      <label htmlFor="show-filter">Show</label>
      <select
        id="show-filter"
        aria-label="Show"
        value={filter}
        onChange={(e) => setFilter(e.target.value as Filter)}
      >
        {FILTER_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ul>
        {visible.map((exp) => (
          <li key={exp.id}>
            <span>{exp.name}</span>
            <span>{exp.status}</span>
            {exp.status === 'done' && exp.winner && (
              <span>{`Winner: ${exp.winner}`}</span>
            )}
            {exp.status === 'running' && !exp.pickingWinner && (
              <button
                aria-label={`Mark done ${exp.name}`}
                onClick={() => startMarkDone(exp.id)}
              >
                Mark done
              </button>
            )}
            {exp.pickingWinner && (
              <>
                <button
                  aria-label={`Winner: A for ${exp.name}`}
                  onClick={() => setWinner(exp.id, 'A')}
                >
                  Winner: A
                </button>
                <button
                  aria-label={`Winner: B for ${exp.name}`}
                  onClick={() => setWinner(exp.id, 'B')}
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
