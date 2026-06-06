'use client'
import { useState } from 'react'

const SEED = [
  { id: 1, task: 'Book moving truck', category: 'Logistics', done: false },
  { id: 2, task: 'Pack kitchen boxes', category: 'Packing', done: false },
  { id: 3, task: 'Transfer utilities', category: 'Admin', done: false },
  { id: 4, task: 'Notify post office', category: 'Admin', done: false },
  { id: 5, task: 'Pack bedroom', category: 'Packing', done: false },
  { id: 6, task: 'Hire movers', category: 'Logistics', done: false },
  { id: 7, task: 'Clean old apartment', category: 'Cleaning', done: false },
  { id: 8, task: 'Pack living room', category: 'Packing', done: false },
]

const CATEGORIES = ['Logistics', 'Packing', 'Admin', 'Cleaning']

export default function App() {
  const [tasks, setTasks] = useState(SEED.map(t => ({ ...t })))
  const [filter, setFilter] = useState('All')
  const [newTask, setNewTask] = useState('')
  const [newCategory, setNewCategory] = useState('Logistics')
  const [nextId, setNextId] = useState(SEED.length + 1)

  const doneCount = tasks.filter(t => t.done).length
  const total = tasks.length

  const visible = filter === 'All' ? tasks : tasks.filter(t => t.category === filter)

  function toggle(id: number) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id: number) {
    setTasks(ts => ts.filter(t => t.id !== id))
  }

  function addTask() {
    if (!newTask.trim()) return
    setTasks(ts => [...ts, { id: nextId, task: newTask.trim(), category: newCategory, done: false }])
    setNextId(n => n + 1)
    setNewTask('')
  }

  function clearCompleted() {
    setTasks(ts => ts.filter(t => !t.done))
  }

  return (
    <div>
      <h1>Moving Checklist</h1>

      <p data-testid="progress">{doneCount} of {total} tasks complete</p>
      <progress data-testid="progress-bar" value={doneCount} max={total} />

      <div>
        {(['All', ...CATEGORIES] as string[]).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {visible.map(t => (
          <li
            key={t.id}
            data-testid="task-item"
            data-completed={t.done ? 'true' : 'false'}
          >
            <input
              type="checkbox"
              aria-label={t.task}
              checked={t.done}
              onChange={() => toggle(t.id)}
            />
            <span>{t.task}</span>
            <span>{t.category}</span>
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div>
        <label>
          New task
          <input
            aria-label="New task"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
          />
        </label>

        <label>
          Category
          <select
            aria-label="Category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <button onClick={addTask}>Add Task</button>
      </div>

      <button onClick={clearCompleted}>Clear Completed</button>
    </div>
  )
}
