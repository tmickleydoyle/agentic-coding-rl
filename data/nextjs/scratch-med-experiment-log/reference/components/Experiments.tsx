'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Filter } from '../lib/types'

const FILTERS: Filter[] = ['All', 'Running', 'Done']

export function Experiments() {
  const { experiments, filter, setFilter, addExperiment, markDone } = useApp()
  const [name, setName] = useState('')
  const [picking, setPicking] = useState<number | null>(null)

  const filtered = experiments.filter((e) => {
    if (filter === 'Running') return e.status === 'running'
    if (filter === 'Done') return e.status === 'done'
    return true
  })

  return (
    <section aria-label="Experiments view">
      <h1>Experiments</h1>
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
      <div role="group" aria-label="Filter experiments">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f ? 'true' : 'false'}
          >
            {f}
          </button>
        ))}
      </div>
      <h2>{`${filter} (${filtered.length})`}</h2>
      <ul>
        {filtered.map((e) => (
          <li key={e.id}>
            <span>{e.name}</span>
            <span>{e.status === 'running' ? 'running' : 'done'}</span>
            {e.status === 'done' && e.winner && <span>{`Winner: ${e.winner}`}</span>}
            {e.status === 'running' && picking !== e.id && (
              <button onClick={() => setPicking(e.id)}>Mark done</button>
            )}
            {e.status === 'running' && picking === e.id && (
              <>
                <button
                  onClick={() => {
                    markDone(e.id, 'A')
                    setPicking(null)
                  }}
                >
                  Winner: A
                </button>
                <button
                  onClick={() => {
                    markDone(e.id, 'B')
                    setPicking(null)
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
