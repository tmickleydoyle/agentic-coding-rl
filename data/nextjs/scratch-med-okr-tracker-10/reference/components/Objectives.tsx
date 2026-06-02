'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress, deleteObjective } = useApp()
  const [newTitle, setNewTitle] = useState('')
  const [drafts, setDrafts] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {}
    objectives.forEach((o) => { init[o.id] = String(o.progress) })
    return init
  })

  function ensureDraft(id: number, current: number) {
    if (drafts[id] === undefined) {
      setDrafts((d) => ({ ...d, [id]: String(current) }))
    }
  }

  return (
    <section aria-label="Objectives view">
      <h1>Objectives</h1>
      <input
        aria-label="Objective title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <button
        onClick={() => {
          addObjective(newTitle)
          setNewTitle('')
        }}
      >
        Add objective
      </button>
      <ul>
        {objectives.map((o) => {
          ensureDraft(o.id, o.progress)
          const draft = drafts[o.id] !== undefined ? drafts[o.id] : String(o.progress)
          return (
            <li key={o.id}>
              <span>{o.title}</span>
              <span>{`Progress: ${o.progress}%`}</span>
              <input
                type="number"
                aria-label={`Progress for ${o.title}`}
                value={draft}
                onChange={(e) => setDrafts((d) => ({ ...d, [o.id]: e.target.value }))}
              />
              <button
                aria-label={`Update ${o.title}`}
                onClick={() => {
                  const val = parseInt(draft, 10)
                  updateProgress(o.id, isNaN(val) ? 0 : val)
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
          )
        })}
      </ul>
    </section>
  )
}
