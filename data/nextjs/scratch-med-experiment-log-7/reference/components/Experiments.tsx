'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Filter } from '../lib/types'

export function Experiments() {
  const { experiments, filter, addExperiment, markDone, setFilter } = useApp()
  const [name, setName] = useState('')
  const [picking, setPicking] = useState<number | null>(null)

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
      <label>
        Show
        <select
          aria-label="Show"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        >
          <option value="All">All</option>
          <option value="Running">Running</option>
          <option value="Done">Done</option>
        </select>
      </label>
      <ul>
        {visible.map((exp) => (
          <li key={exp.id}>
            <span>{exp.name}</span>
            <span>{` — ${exp.status}`}</span>
            {exp.status === 'done' && exp.winner && (
              <span>{` Winner: ${exp.winner}`}</span>
            )}
            {exp.status === 'running' && picking !== exp.id && (
              <button onClick={() => setPicking(exp.id)}>Mark done</button>
            )}
            {exp.status === 'running' && picking === exp.id && (
              <span>
                <button
                  onClick={() => {
                    markDone(exp.id, 'A')
                    setPicking(null)
                  }}
                >
                  Winner: A
                </button>
                <button
                  onClick={() => {
                    markDone(exp.id, 'B')
                    setPicking(null)
                  }}
                >
                  Winner: B
                </button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
