'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Filter } from '../lib/types'

export function Experiments() {
  const { experiments, filter, addExperiment, deleteExperiment, resolveExperiment, setFilter } = useApp()
  const [name, setName] = useState('')
  const [pendingId, setPendingId] = useState<number | null>(null)

  const visible = experiments.filter((e) => {
    if (filter === 'Running') return e.status === 'running'
    if (filter === 'Done') return e.status === 'done'
    return true
  })

  function handleAdd() {
    addExperiment(name)
    setName('')
  }

  return (
    <section aria-label="Experiments view">
      <h1>{`Experiments (${visible.length})`}</h1>
      <input
        aria-label="Experiment name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd}>Add experiment</button>
      <label htmlFor="show-filter">Show</label>
      <select
        id="show-filter"
        aria-label="Show"
        value={filter}
        onChange={(e) => setFilter(e.target.value as Filter)}
      >
        <option value="All">All</option>
        <option value="Running">Running</option>
        <option value="Done">Done</option>
      </select>
      <ul>
        {visible.map((exp) => (
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
                    resolveExperiment(exp.id, 'A')
                    setPendingId(null)
                  }}
                >
                  Winner: A
                </button>
                <button
                  onClick={() => {
                    resolveExperiment(exp.id, 'B')
                    setPendingId(null)
                  }}
                >
                  Winner: B
                </button>
              </>
            )}
            <button onClick={() => deleteExperiment(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
