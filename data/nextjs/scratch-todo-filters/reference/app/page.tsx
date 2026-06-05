'use client'
import { useState } from 'react'

type Todo = { id: number; text: string; completed: boolean }
type Filter = 'All' | 'Active' | 'Completed'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('All')
  const [nextId, setNextId] = useState(1)

  function addTodo() {
    const text = input.trim()
    if (!text) return
    setTodos((ts) => [...ts, { id: nextId, text, completed: false }])
    setNextId((n) => n + 1)
    setInput('')
  }

  function toggleTodo(id: number) {
    setTodos((ts) =>
      ts.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTodo(id: number) {
    setTodos((ts) => ts.filter((t) => t.id !== id))
  }

  function clearCompleted() {
    setTodos((ts) => ts.filter((t) => !t.completed))
  }

  const activeCount = todos.filter((t) => !t.completed).length
  const hasCompleted = todos.some((t) => t.completed)

  const visibleTodos = todos.filter((t) => {
    if (filter === 'Active') return !t.completed
    if (filter === 'Completed') return t.completed
    return true
  })

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          aria-label="New todo"
          placeholder="New todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addTodo() }}
        />
        <button onClick={addTodo}>Add todo</button>
      </div>
      <ul>
        {visibleTodos.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              aria-label={`Toggle ${t.text}`}
              checked={t.completed}
              onChange={() => toggleTodo(t.id)}
            />
            <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
              {t.text}
            </span>
            <button onClick={() => deleteTodo(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <footer>
        <span>{`${activeCount} items left`}</span>
        <div>
          {(['All', 'Active', 'Completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={clearCompleted} disabled={!hasCompleted}>
          Clear completed
        </button>
      </footer>
    </div>
  )
}
