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
        <span>{` — done — Winner: ${exp.winner}`}</span>
      </li>
    )
  }

  return (
    <li>
      <span>{exp.name}</span>
      <span>{' — running'}</span>
      {!picking && (
        <button onClick={() => setPicking(true)}>{`Mark done`}</button>
      )}
      {picking && (
        <>
          <button
            onClick={() => {
              markDone(exp.id, 'A')
              setPicking(false)
            }}
          >
            Winner A
          </button>
          <button
            onClick={() => {
              markDone(exp.id, 'B')
              setPicking(false)
            }}
          >
            Winner B
          </button>
        </>
      )}
    </li>
  )
}

export function Experiments() {
  const { experiments, addExperiment, showRunningOnly, toggleShowRunningOnly } = useApp()
  const [name, setName] = useState('')

  const visible = showRunningOnly
    ? experiments.filter((e) => e.status === 'running')
    : experiments

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
        <input
          type="checkbox"
          aria-label="Show running only"
          checked={showRunningOnly}
          onChange={toggleShowRunningOnly}
        />
        Show running only
      </label>
      <ul>
        {visible.map((exp) => (
          <ExperimentRow key={exp.id} exp={exp} />
        ))}
      </ul>
    </section>
  )
}
