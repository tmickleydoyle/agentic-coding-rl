'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress, deleteObjective, filterOnTrack } = useApp()
  const [title, setTitle] = useState('')
  const [progressInputs, setProgressInputs] = useState<Record<number, string>>({})

  const displayed = filterOnTrack ? objectives.filter((o) => o.progress >= 70) : objectives

  function handleAdd() {
    addObjective(title)
    setTitle('')
  }

  function handleUpdate(id: number) {
    const raw = progressInputs[id]
    if (raw === undefined || raw === '') return
    const val = Number(raw)
    if (isNaN(val)) return
    updateProgress(id, val)
    setProgressInputs((prev) => { const next = { ...prev }; delete next[id]; return next })
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
        {displayed.map((o) => (
          <li key={o.id}>
            <span>{o.title}</span>
            <span>{o.progress >= 70 ? ' On Track' : ' Off Track'}</span>
            <span>{`Progress: ${o.progress}%`}</span>
            <input
              type="number"
              aria-label={`Set progress for ${o.title}`}
              value={progressInputs[o.id] !== undefined ? progressInputs[o.id] : o.progress}
              onChange={(e) =>
                setProgressInputs((prev) => ({ ...prev, [o.id]: e.target.value }))
              }
            />
            <button onClick={() => handleUpdate(o.id)}>Update</button>
            <button aria-label={`Delete ${o.title}`} onClick={() => deleteObjective(o.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
