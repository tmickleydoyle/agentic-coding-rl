'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Objectives() {
  const { objectives, addObjective, updateProgress, deleteObjective } = useApp()
  const [title, setTitle] = useState('')
  const [drafts, setDrafts] = useState<Record<number, string>>(() => {
    const m: Record<number, string> = {}
    objectives.forEach((o) => { m[o.id] = String(o.progress) })
    return m
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
                min={0}
                max={100}
                value={draft}
                onChange={(e) => setDrafts((d) => ({ ...d, [o.id]: e.target.value }))}
              />
              <button
                onClick={() => {
                  const val = parseInt(draft, 10)
                  updateProgress(o.id, isNaN(val) ? 0 : val)
                }}
              >
                Update
              </button>
              <button onClick={() => deleteObjective(o.id)}>Delete</button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
