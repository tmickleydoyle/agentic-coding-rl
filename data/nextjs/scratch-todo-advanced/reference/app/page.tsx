'use client'
import { useState } from 'react'

type Priority = 'low' | 'medium' | 'high'

interface Todo {
  id: number
  text: string
  priority: Priority
  done: boolean
}

const SEED: Todo[] = [
  { id: 1, text: 'Write unit tests', priority: 'high', done: false },
  { id: 2, text: 'Update documentation', priority: 'medium', done: false },
  { id: 3, text: 'Fix login bug', priority: 'high', done: true },
  { id: 4, text: 'Refactor database queries', priority: 'low', done: false },
]

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(SEED.map(t => ({ ...t })))
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [nextId, setNextId] = useState(5)

  function add() {
    if (!text.trim()) return
    setTodos(ts => [...ts, { id: nextId, text: text.trim(), priority, done: false }])
    setNextId(n => n + 1)
    setText('')
    setPriority('medium')
  }

  function toggle(id: number) {
    setTodos(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function remove(id: number) {
    setTodos(ts => ts.filter(t => t.id !== id))
  }

  const filtered = todos.filter(t => {
    const statusOk = statusFilter === 'all'
      || (statusFilter === 'active' && !t.done)
      || (statusFilter === 'completed' && t.done)
    const priorityOk = priorityFilter === 'all' || t.priority === priorityFilter
    return statusOk && priorityOk
  })

  const totalCount = todos.length
  const activeCount = todos.filter(t => !t.done).length
  const doneCount = todos.filter(t => t.done).length

  return (
    <div>
      <h1>Advanced Todo</h1>
      <div>
        <input
          aria-label="Task"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <select
          aria-label="Priority"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button onClick={add}>Add</button>
      </div>
      <div>
        <select
          aria-label="Status Filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">all</option>
          <option value="active">active</option>
          <option value="completed">completed</option>
        </select>
        <select
          aria-label="Priority Filter"
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
        >
          <option value="all">all</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </div>
      <ul>
        {filtered.map(t => (
          <li key={t.id} data-testid="todo-item">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)}
              aria-label={`toggle ${t.text}`}
            />
            <span>{t.text}</span>
            <span data-testid="priority-badge">{t.priority}</span>
            <button onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <span data-testid="total-count">{totalCount}</span>
        <span data-testid="active-count">{activeCount}</span>
        <span data-testid="done-count">{doneCount}</span>
      </div>
    </div>
  )
}
