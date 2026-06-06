'use client'
import React, { createContext, useContext, useState } from 'react'
import { Poll, Vote, Route } from '../lib/types'
interface AppState { route: Route; polls: Poll[]; votes: Vote[]; navigate: (r: Route) => void; setPolls: (p: Poll[]) => void; setVotes: (v: Vote[]) => void }
const AppContext = createContext<AppState>({ route: 'home', polls: [], votes: [], navigate: () => {}, setPolls: () => {}, setVotes: () => {} })
export function useApp() { return useContext(AppContext) }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route] = useState<Route>('home')
  return <AppContext.Provider value={{ route, polls: [], votes: [], navigate: () => {}, setPolls: () => {}, setVotes: () => {} }}>{children}</AppContext.Provider>
}
