'use client'
import { useState } from 'react'

type Todo = { id: number; text: string; done: boolean }

const INITIAL: Todo[] = [
  { id: 1, text: 'Write tests', done: false },
  { id: 2, text: 'Fix bug', done: false },
  { id: 3, text: 'Ship it', done: false },
]

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL)

  const toggle = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return (
    <ul>
      {todos.map((t) => (
        <li key={t.id}>
          <input
            type="checkbox"
            data-testid={`toggle-${t.id}`}
            checked={t.done}
            onChange={() => toggle(t.id)}
          />
          <span data-testid={`label-${t.id}`} className={t.done ? 'done' : ''}>
            {t.text}
          </span>
        </li>
      ))}
    </ul>
  )
}
