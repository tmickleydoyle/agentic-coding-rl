'use client'
import { useState } from 'react'

export default function TodoList() {
  const [items, setItems] = useState<{ id: number; text: string }[]>([])
  const [draft, setDraft] = useState('')

  const add = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    setItems((prev) => [...prev, { id: Date.now() + Math.random(), text: trimmed }])
    setDraft('')
  }

  const remove = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id))

  return (
    <div>
      <input
        type="text"
        data-testid="todo-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button data-testid="add-btn" onClick={add}>
        Add
      </button>
      <ul data-testid="todo-list">
        {items.map((t) => (
          <li key={t.id}>
            {t.text}
            <button onClick={() => remove(t.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
