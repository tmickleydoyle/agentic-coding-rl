'use client'
import { useState, useEffect, useRef } from 'react'

const MODES: Record<string, number> = {
  Work: 1500,
  'Short Break': 300,
  'Long Break': 900,
}

interface Task {
  id: number
  text: string
  done: boolean
}

let nextTaskId = 1

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function App() {
  const [mode, setMode] = useState('Work')
  const [timeLeft, setTimeLeft] = useState(MODES['Work'])
  const [running, setRunning] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')

  const intervalRef = useRef<number | null>(null)
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            window.clearInterval(intervalRef.current!)
            intervalRef.current = null
            setRunning(false)
            if (modeRef.current === 'Work') {
              setPomodoroCount(c => c + 1)
            }
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [running])

  function switchMode(m: string) {
    setMode(m)
    setTimeLeft(MODES[m])
    setRunning(false)
  }

  function reset() {
    setRunning(false)
    setTimeLeft(MODES[mode])
  }

  function addTask() {
    if (!newTask.trim()) return
    setTasks(ts => [...ts, { id: nextTaskId++, text: newTask.trim(), done: false }])
    setNewTask('')
  }

  function toggleTask(id: number) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function removeTask(id: number) {
    setTasks(ts => ts.filter(t => t.id !== id))
  }

  return (
    <div>
      <h1>Pomodoro Timer</h1>

      <div>
        {Object.keys(MODES).map(m => (
          <button key={m} onClick={() => switchMode(m)}>{m}</button>
        ))}
      </div>

      <p data-testid="current-mode">{mode}</p>
      <p data-testid="timer-display">{formatTime(timeLeft)}</p>

      <div>
        <button onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Start'}</button>
        <button onClick={reset}>Reset</button>
      </div>

      <p data-testid="pomodoro-count">Pomodoros: {pomodoroCount}</p>

      <div>
        <input
          aria-label="New task"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map(t => (
          <li key={t.id} data-testid="task-row" data-done={t.done ? 'true' : 'false'}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTask(t.id)}
              aria-label={t.text}
            />
            <span>{t.text}</span>
            <button onClick={() => removeTask(t.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
