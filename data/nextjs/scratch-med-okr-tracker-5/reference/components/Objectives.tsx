'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress, deleteObjective } = useApp()
  const [title, setTitle] = useState('')
  const [inputs, setInputs] = useState<Record<number, string>>({})

  function handleAdd() {
    addObjective(title)
    setTitle('')
  }

  function handleUpdate(id: number) {
    const raw = inputs[id] ?? ''
    const val = parseFloat(raw)
    if (isNaN(val)) return
    updateProgress(id, Math.round(val))
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
              aria-label={`Progress for ${o.title}`}
              type="number"
              value={inputs[o.id] ?? ''}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, [o.id]: e.target.value }))
              }
            />
            <button onClick={() => handleUpdate(o.id)}>Update</button>
            <button onClick={() => deleteObjective(o.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
