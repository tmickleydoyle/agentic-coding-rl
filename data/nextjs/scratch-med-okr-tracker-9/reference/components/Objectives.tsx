'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress, removeObjective } = useApp()
  const [title, setTitle] = useState('')
  const [inputs, setInputs] = useState<Record<number, string>>({})

  function handleAdd() {
    addObjective(title)
    setTitle('')
  }

  function handleUpdate(id: number) {
    const raw = inputs[id]
    if (raw === undefined || raw === '') return
    const val = Number(raw)
    if (isNaN(val) || val < 0 || val > 100) return
    updateProgress(id, Math.round(val))
  }

  return (
    <section aria-label="Objectives view">
      <h1>Objectives</h1>
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
              aria-label={`Set progress for ${o.title}`}
              value={inputs[o.id] ?? String(o.progress)}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, [o.id]: e.target.value }))
              }
              min={0}
              max={100}
            />
            <button onClick={() => handleUpdate(o.id)}>Update</button>
            <button onClick={() => removeObjective(o.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
