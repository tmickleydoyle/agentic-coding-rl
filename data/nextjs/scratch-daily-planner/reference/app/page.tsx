'use client'
import { useState } from 'react'

interface Task {
  id: number
  title: string
  time: string
  priority: 'high' | 'medium' | 'low'
  done: boolean
}

const SEED: Task[] = [
  { id: 1, title: 'Team standup', time: '09:00', priority: 'high', done: false },
  { id: 2, title: 'Write report', time: '10:30', priority: 'medium', done: false },
  { id: 3, title: 'Lunch break', time: '12:00', priority: 'low', done: true },
  { id: 4, title: 'Code review', time: '14:00', priority: 'high', done: false },
]

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(SEED.map(t => ({ ...t })))
  const [titleInput, setTitleInput] = useState('')
  const [timeInput, setTimeInput] = useState('09:00')
  const [priorityInput, setPriorityInput] = useState<'high' | 'medium' | 'low'>('medium')

  function toggleDone(id: number) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function addTask() {
    if (!titleInput.trim()) return
    setTasks(ts => [
      ...ts,
      { id: Date.now(), title: titleInput.trim(), time: timeInput, priority: priorityInput, done: false },
    ])
    setTitleInput('')
  }

  function clearDone() {
    setTasks(ts => ts.filter(t => !t.done))
  }

  const doneCount = tasks.filter(t => t.done).length
  const pendingCount = tasks.length - doneCount

  return (
    <div>
      <h1>Daily Planner</h1>
      <p data-testid="total-tasks">Total: {tasks.length}</p>
      <p data-testid="done-tasks">Done: {doneCount}</p>
      <p data-testid="pending-tasks">Pending: {pendingCount}</p>
      <button onClick={clearDone}>Clear Done</button>
      <ul>
        {tasks.map(t => (
          <li key={t.id} data-testid="task-item" className={t.done ? 'done' : ''}>
            <input
              type="checkbox"
              aria-label={`Mark ${t.title} done`}
              checked={t.done}
              onChange={() => toggleDone(t.id)}
            />
            <span>{t.title}</span>
            <span data-testid="task-time">{t.time}</span>
            <span data-testid="task-priority">{t.priority}</span>
          </li>
        ))}
      </ul>
      <div>
        <input
          aria-label="Task title"
          value={titleInput}
          onChange={e => setTitleInput(e.target.value)}
        />
        <input
          type="time"
          aria-label="Task time"
          value={timeInput}
          onChange={e => setTimeInput(e.target.value)}
        />
        <select
          aria-label="Priority"
          value={priorityInput}
          onChange={e => setPriorityInput(e.target.value as 'high' | 'medium' | 'low')}
        >
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  )
}
