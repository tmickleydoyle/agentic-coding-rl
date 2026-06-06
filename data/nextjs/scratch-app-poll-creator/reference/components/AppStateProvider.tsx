'use client'
import React, { createContext, useContext, useState } from 'react'
import { Poll, Vote, Route } from '../lib/types'

interface AppState {
  route: Route
  polls: Poll[]
  votes: Vote[]
  navigate: (r: Route) => void
  setPolls: (p: Poll[]) => void
  setVotes: (v: Vote[]) => void
}

const AppContext = createContext<AppState>({
  route: 'home', polls: [], votes: [],
  navigate: () => {}, setPolls: () => {}, setVotes: () => {},
})

export function useApp() { return useContext(AppContext) }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home')
  const [polls, setPolls] = useState<Poll[]>([
    { id: 'p1', question: 'Best programming language?', options: ['Python', 'TypeScript', 'Rust'] },
    { id: 'p2', question: 'Preferred work style?', options: ['Remote', 'Hybrid', 'Office'] },
    { id: 'p3', question: 'Favorite season?', options: ['Spring', 'Summer', 'Fall', 'Winter'] },
  ])
  const [votes, setVotes] = useState<Vote[]>([
    { id: 'v1', pollId: 'p1', option: 'TypeScript' },
    { id: 'v2', pollId: 'p1', option: 'Python' },
    { id: 'v3', pollId: 'p1', option: 'TypeScript' },
    { id: 'v4', pollId: 'p2', option: 'Remote' },
    { id: 'v5', pollId: 'p2', option: 'Remote' },
    { id: 'v6', pollId: 'p2', option: 'Hybrid' },
  ])

  return (
    <AppContext.Provider value={{ route, polls, votes, navigate: setRoute, setPolls, setVotes }}>
      {children}
    </AppContext.Provider>
  )
}
