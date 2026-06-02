'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Experiment } from '../lib/types'

export function Experiments() {
  const { experiments, addExperiment, markDone } = useApp()
  const [name, setName] = useState('')
  const [filter, setFilter] = useState<'All' | 'Running' | 'Done'>('All')
  const [pendingId, setPendingId] = useState<number | null>(null)

  const visible: Experiment[] =
    filter === 'All'
      ? experiments
      : filter === 'Running'
      ? experiments.filter((e) => e.status === 'running')
      : experiments.filter((e) => e.status === 'done')

  function handleAdd() {
    addExperiment(name)
    setName('')
  }

  function handleMarkDone(id: number) {
    setPendingId(id)
  }

  function handleWinner(id: number, winner: 'A' | 'B') {
    markDone(id, winner)
    setPendingId(null)
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
      <label>
        Filter by status
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | 'Running' | 'Done')}
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
            <span>{exp.status}</span>
            {exp.status === 'done' && exp.winner && <span>{`Winner: ${exp.winner}`}</span>}
            {exp.status === 'running' && pendingId !== exp.id && (
              <button onClick={() => handleMarkDone(exp.id)}>Mark done</button>
            )}
            {exp.status === 'running' && pendingId === exp.id && (
              <>
                <button onClick={() => handleWinner(exp.id, 'A')}>Winner: A</button>
                <button onClick={() => handleWinner(exp.id, 'B')}>Winner: B</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
