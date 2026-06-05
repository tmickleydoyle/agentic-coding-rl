'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Poll, Route, Theme } from '../lib/types'

type AppApi = {
  polls: Poll[]
  theme: Theme
  route: Route
  selectedPollId: string | null
  vote: (pollId: string, optionId: string) => void
  createPoll: (question: string, labels: string[]) => string | null
  setTheme: (theme: Theme) => void
  openPoll: (pollId: string) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

function seedPolls(): Poll[] {
  return [
    {
      id: 'q1',
      question: 'Best language?',
      options: [
        { id: 'q1-o1', label: 'Rust', votes: 5 },
        { id: 'q1-o2', label: 'Go', votes: 3 },
        { id: 'q1-o3', label: 'TS', votes: 7 },
      ],
      votedOptionId: null,
    },
    {
      id: 'q2',
      question: 'Tabs or spaces?',
      options: [
        { id: 'q2-o1', label: 'Tabs', votes: 2 },
        { id: 'q2-o2', label: 'Spaces', votes: 6 },
      ],
      votedOptionId: 'q2-o2',
    },
    {
      id: 'q3',
      question: 'Coffee or tea?',
      options: [
        { id: 'q3-o1', label: 'Coffee', votes: 4 },
        { id: 'q3-o2', label: 'Tea', votes: 4 },
      ],
      votedOptionId: null,
    },
  ]
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [polls, setPolls] = useState<Poll[]>(seedPolls)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('polls')
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null)
  const [nextPollId, setNextPollId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const vote = (pollId: string, optionId: string) => {
      setPolls((prev) =>
        prev.map((p) => {
          if (p.id !== pollId) return p
          if (p.votedOptionId) return p
          if (!p.options.some((o) => o.id === optionId)) return p
          return {
            ...p,
            votedOptionId: optionId,
            options: p.options.map((o) =>
              o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
            ),
          }
        }),
      )
    }

    const createPoll = (question: string, labels: string[]): string | null => {
      const q = question.trim()
      if (q.length === 0) return null
      const clean = labels.map((l) => l.trim()).filter((l) => l.length > 0)
      if (clean.length < 2) return null
      const id = `q${nextPollId}`
      setNextPollId((n) => n + 1)
      const poll: Poll = {
        id,
        question: q,
        options: clean.map((label, i) => ({ id: `${id}-o${i + 1}`, label, votes: 0 })),
        votedOptionId: null,
      }
      setPolls((prev) => [...prev, poll])
      return id
    }

    const openPoll = (pollId: string) => {
      setSelectedPollId(pollId)
      setRoute('poll')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      polls,
      theme,
      route,
      selectedPollId,
      vote,
      createPoll,
      setTheme,
      openPoll,
      navigate,
    }
  }, [polls, theme, route, selectedPollId, nextPollId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
