'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Experiment } from '../lib/types'

function ExperimentRow({ exp }: { exp: Experiment }) {
  const { markDone } = useApp()
  const [picking, setPicking] = useState(false)

  if (exp.status === 'done') {
    return (
      <li>
        <span>{exp.name}</span>
        <span>{` — done, winner: ${exp.winner}`}</span>
      </li>
    )
  }

  return (
    <li>
      <span>{exp.name}</span>
      <span>{` — running`}</span>
      {!picking && (
        <button onClick={() => setPicking(true)}>Mark done</button>
      )}
      {picking && (
        <>
          <button
            onClick={() => {
              markDone(exp.id, 'A')
              setPicking(false)
            }}
          >
            Winner: A
          </button>
          <button
            onClick={() => {
              markDone(exp.id, 'B')
              setPicking(false)
            }}
          >
            Winner: B
          </button>
        </>
      )}
    </li>
  )
}

export function Experiments() {
  const { experiments, filter, setFilter, addExperiment } = useApp()
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
      <label htmlFor="exp-filter">Show</label>
      <select
        id="exp-filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value as 'All' | 'Running' | 'Done')}
      >
        <option value="All">All</option>
        <option value="Running">Running</option>
        <option value="Done">Done</option>
      </select>
      <ul>
        {visible.map((e) => (
          <ExperimentRow key={e.id} exp={e} />
        ))}
      </ul>
    </section>
  )
}
