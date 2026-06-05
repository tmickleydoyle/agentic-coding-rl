'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function ObjectivesView() {
  const { objectives, addObjective, updateProgress, deleteObjective } = useApp()
  const [title, setTitle] = useState('')
  const [drafts, setDrafts] = useState<Record<number, string>>({})

  function getDraft(id: number, current: number): string {
    return drafts[id] !== undefined ? drafts[id] : String(current)
  }

  return (
    <section aria-label="Objectives view">
      <h1>Objectives</h1>
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
                updateProgress(o.id, isNaN(val) ? 0 : val)
                setDrafts((d) => {
                  const copy = { ...d }
                  delete copy[o.id]
                  return copy
                })
              }}
            >
              Update
            </button>
            <button
              aria-label={`Delete ${o.title}`}
              onClick={() => deleteObjective(o.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
