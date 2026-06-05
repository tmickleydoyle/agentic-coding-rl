'use client'
import { useState } from 'react'

type Card = { id: number; title: string; col: number }
const COLUMNS = ['Backlog', 'In Progress', 'Done']

export default function App() {
  const [cards, setCards] = useState<Card[]>([])
  const [title, setTitle] = useState('')
  const [nextId, setNextId] = useState(1)

  function add() {
    const t = title.trim()
    if (!t) return
    setCards((cs) => [...cs, { id: nextId, title: t, col: 0 }])
    setNextId((n) => n + 1)
    setTitle('')
  }

  function move(id: number, delta: number) {
    setCards((cs) =>
      cs.map((c) =>
        c.id === id
          ? { ...c, col: Math.max(0, Math.min(COLUMNS.length - 1, c.col + delta)) }
          : c,
      ),
    )
  }

  return (
    <div>
      <h1>Kanban Board</h1>
      <div>
        <input
          aria-label="Card title"
          placeholder="Card title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={add}>Add card</button>
      </div>
      <div>
        {COLUMNS.map((name, ci) => {
          const colCards = cards.filter((c) => c.col === ci)
          return (
            <section key={name} aria-label={name}>
              <h2>
                {name} ({colCards.length})
              </h2>
              <ul>
                {colCards.map((c) => (
                  <li key={c.id}>
                    <span>{c.title}</span>
                    <button onClick={() => move(c.id, -1)} disabled={ci === 0}>
                      Move left
                    </button>
                    <button onClick={() => move(c.id, 1)} disabled={ci === COLUMNS.length - 1}>
                      Move right
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
