'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress, removeObjective } = useApp()
  const [title, setTitle] = useState('')
  const [progressInputs, setProgressInputs] = useState<Record<number, string>>({})

  function handleAdd() {
    addObjective(title)
    setTitle('')
  }

  function handleUpdate(id: number) {
    const val = progressInputs[id]
    if (val === undefined || val === '') return
    updateProgress(id, Number(val))
  }

  return (
    <section aria-label="Objectives view">
      <h1>{`Objectives (${objectives.length})`}</h1>
      <input
        aria-label="Objective title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleAdd}>Add objective</button>
      <ul>
        {objectives.map((o) => (
          <li key={o.id}>
            <span>{o.title}</span>
            <span>{`Progress: ${o.progress}%`}</span>
            <input
              type="number"
              aria-label={`Progress for ${o.title}`}
              min={0}
              max={100}
              value={progressInputs[o.id] ?? o.progress}
              onChange={(e) =>
                setProgressInputs((prev) => ({ ...prev, [o.id]: e.target.value }))
              }
            />
            <button onClick={() => handleUpdate(o.id)}>Update</button>
            <button aria-label={`Remove ${o.title}`} onClick={() => removeObjective(o.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
