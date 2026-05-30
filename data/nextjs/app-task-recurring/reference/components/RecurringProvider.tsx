'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { HistoryEntry, Route, Schedule, Task, Theme } from '../lib/types'
import { nextDueDate, TODAY } from '../lib/types'

type NewTaskInput = { title: string; schedule: Schedule }

type RecurringApi = {
  tasks: Task[]
  history: HistoryEntry[]
  theme: Theme
  route: Route
  today: string
  addTask: (input: NewTaskInput) => void
  completeTask: (id: string) => void
  removeTask: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const RecurringContext = createContext<RecurringApi | null>(null)

const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Water plants', schedule: 'daily', nextDue: '2026-05-29' },
  { id: 't2', title: 'Take meds', schedule: 'daily', nextDue: '2026-05-28' },
  { id: 't3', title: 'Team sync', schedule: 'weekly', nextDue: '2026-06-02' },
]

const SEED_HISTORY: HistoryEntry[] = [
  { id: 'h1', taskId: 't1', title: 'Water plants', completedOn: '2026-05-28' },
]

export function RecurringProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [history, setHistory] = useState<HistoryEntry[]>(SEED_HISTORY)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [nextTaskId, setNextTaskId] = useState(4)
  const [nextHistoryId, setNextHistoryId] = useState(2)

  const value = useMemo<RecurringApi>(() => {
    const addTask = (input: NewTaskInput) => {
      const trimmed = input.title.trim()
      if (trimmed.length === 0) return
      const id = `t${nextTaskId}`
      setNextTaskId((n) => n + 1)
      setTasks((prev) => [
        ...prev,
        { id, title: trimmed, schedule: input.schedule, nextDue: TODAY },
      ])
    }

    const completeTask = (id: string) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return
      const hid = `h${nextHistoryId}`
      setNextHistoryId((n) => n + 1)
      setHistory((prev) => [
        ...prev,
        { id: hid, taskId: task.id, title: task.title, completedOn: TODAY },
      ])
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, nextDue: nextDueDate(TODAY, t.schedule) } : t,
        ),
      )
    }

    const removeTask = (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      tasks,
      history,
      theme,
      route,
      today: TODAY,
      addTask,
      completeTask,
      removeTask,
      setTheme,
      navigate,
    }
  }, [tasks, history, theme, route, nextTaskId, nextHistoryId])

  return <RecurringContext.Provider value={value}>{children}</RecurringContext.Provider>
}

export function useRecurring(): RecurringApi {
  const v = useContext(RecurringContext)
  if (!v) throw new Error('useRecurring must be used within a RecurringProvider')
  return v
}
