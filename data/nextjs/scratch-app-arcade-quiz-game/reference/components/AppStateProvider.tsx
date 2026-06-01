'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { QuizState, Route, Theme } from '../lib/types'
import { answer, startQuiz } from '../lib/quiz'

type Entry = { id: string; name: string; score: number }

type AppApi = {
  quiz: QuizState
  category: string | null
  theme: Theme
  route: Route
  lastScore: number | null
  entries: Entry[]
  choose: (choice: number) => void
  start: (category: string | null) => void
  restart: () => void
  submit: (name: string) => string | null
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

function rank(entries: Entry[]): Entry[] {
  return entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) => b.e.score - a.e.score || a.i - b.i)
    .map((x) => x.e)
}

function seedEntries(): Entry[] {
  return [
    { id: 'e1', name: 'Ada', score: 50 },
    { id: 'e2', name: 'Bo', score: 30 },
  ]
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [quiz, setQuiz] = useState<QuizState>(() => startQuiz(null))
  const [category, setCategory] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('categories')
  const [lastScore, setLastScore] = useState<number | null>(null)
  const [entries, setEntries] = useState<Entry[]>(seedEntries)
  const [nextEntryId, setNextEntryId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const choose = (choice: number) => {
      setQuiz((q) => {
        const next = answer(q, choice)
        if (next === q) return q
        if (next.done) {
          setLastScore(next.score)
          setRoute('results')
        }
        return next
      })
    }

    const start = (cat: string | null) => {
      setCategory(cat)
      setQuiz(startQuiz(cat))
      setRoute('play')
    }

    const restart = () => {
      setQuiz(startQuiz(category))
      setRoute('play')
    }

    const submit = (name: string): string | null => {
      const n = name.trim()
      if (n.length === 0) return null
      const id = `e${nextEntryId}`
      setNextEntryId((x) => x + 1)
      setEntries((prev) => [...prev, { id, name: n, score: lastScore ?? 0 }])
      return id
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      quiz,
      category,
      theme,
      route,
      lastScore,
      entries: rank(entries),
      choose,
      start,
      restart,
      submit,
      setTheme,
      navigate,
    }
  }, [quiz, category, theme, route, lastScore, entries, nextEntryId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
