'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress, deleteObjective } = useApp()
  const [title, setTitle] = useState('')
  const [drafts, setDrafts] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {}
    objectives.forEach((o) => { init[o.id] = String(o.progress) })
    return init
  })

  function handleAdd() {
    const t = title.trim()
    if (!t) return
    addObjective(t)
    setTitle('')
  }

  function getDraft(id: number, current: number): string {
    return id in drafts ? drafts[id] : String(current)
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
              aria-label={`Progress for ${o.title}`}
              min={0}
              max={100}
              value={getDraft(o.id, o.progress)}
              onChange={(e) =>
                setDrafts((d) => ({ ...d, [o.id]: e.target.value }))
              }
            />
            <button
              onClick={() => {
                const val = parseInt(getDraft(o.id, o.progress), 10)
                updateProgress(o.id, isNaN(val) ? o.progress : val)
              }}
            >
              Update
            </button>
            <button onClick={() => deleteObjective(o.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
