'use client'
import { useState } from 'react'

type Column = 'Todo' | 'In Progress' | 'Done'

interface Task {
  id: number
  title: string
  column: Column
}

const COLUMNS: Column[] = ['Todo', 'In Progress', 'Done']

const SEED: Task[] = [
  { id: 1, title: 'Write tests', column: 'Todo' },
  { id: 2, title: 'Fix login bug', column: 'In Progress' },
  { id: 3, title: 'Deploy to staging', column: 'Todo' },
  { id: 4, title: 'Update README', column: 'Done' },
  { id: 5, title: 'Review PR', column: 'In Progress' },
]

function columnTestId(col: Column): string {
  if (col === 'Todo') return 'column-todo'
  if (col === 'In Progress') return 'column-inprogress'
  return 'column-done'
}

function countTestId(col: Column): string {
  if (col === 'Todo') return 'count-todo'
  if (col === 'In Progress') return 'count-inprogress'
  return 'count-done'
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(SEED.map(t => ({ ...t })))
  const [newTitle, setNewTitle] = useState('')
  const [newColumn, setNewColumn] = useState<Column>('Todo')

  function moveTask(id: number, direction: 'left' | 'right') {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const idx = COLUMNS.indexOf(t.column)
      if (direction === 'left' && idx > 0) return { ...t, column: COLUMNS[idx - 1] }
      if (direction === 'right' && idx < COLUMNS.length - 1) return { ...t, column: COLUMNS[idx + 1] }
      return t
    }))
  }

  function addTask() {
    if (!newTitle.trim()) return
    setTasks(prev => [...prev, { id: prev.length + 1, title: newTitle.trim(), column: newColumn }])
    setNewTitle('')
    setNewColumn('Todo')
  }

  return (
    <div>
      <h1>Kanban Board</h1>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.column === col)
          return (
            <div key={col} data-testid={columnTestId(col)}>
              <h2>
                {col} <span data-testid={countTestId(col)}>{colTasks.length}</span>
              </h2>
              <ul>
                {colTasks.map(t => {
                  const colIdx = COLUMNS.indexOf(col)
                  return (
                    <li key={t.id} data-testid="task-card">
                      <span>{t.title}</span>
                      <button
                        onClick={() => moveTask(t.id, 'left')}
                        disabled={colIdx === 0}
                      >
                        Move Left
                      </button>
                      <button
                        onClick={() => moveTask(t.id, 'right')}
                        disabled={colIdx === COLUMNS.length - 1}
                      >
                        Move Right
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      <div>
        <h2>Add Task</h2>
        <label>
          Task Title
          <input
            aria-label="Task Title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
        </label>
        <label>
          Column
          <select
            aria-label="Column"
            value={newColumn}
            onChange={e => setNewColumn(e.target.value as Column)}
          >
            {COLUMNS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  )
}
