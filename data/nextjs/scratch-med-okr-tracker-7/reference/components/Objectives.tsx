'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress, removeObjective } = useApp()
  const [title, setTitle] = useState('')
  const [inputs, setInputs] = useState<Record<number, string>>({})

  function getInput(id: number, current: number): string {
    return inputs[id] !== undefined ? inputs[id] : String(current)
  }

  return (
    <section aria-label="Objectives view">
      <h1>{`Objectives (${objectives.length})`}</h1>
      <input
        aria-label="Objective title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          addObjective(title)
          setTitle('')
        }}
      >
        Add objective
      </button>
      <ul>
        {objectives.map((o) => (
          <li key={o.id}>
            <span>{o.title}</span>
            <span>{`Progress: ${o.progress}%`}</span>
            <input
              type="number"
              aria-label={`Set progress for ${o.title}`}
              value={getInput(o.id, o.progress)}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, [o.id]: e.target.value }))
              }
            />
            <button
              onClick={() => {
                const val = parseInt(getInput(o.id, o.progress), 10)
                updateProgress(o.id, isNaN(val) ? 0 : val)
                setInputs((prev) => {
                  const next = { ...prev }
                  delete next[o.id]
                  return next
                })
              }}
            >
              Update
            </button>
            <button onClick={() => removeObjective(o.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
