'use client'
import React, { createContext, useContext, useState } from 'react'
import { Track, QueueItem, Route } from '../lib/types'
interface AppState { route: Route; tracks: Track[]; queue: QueueItem[]; navigate: (r: Route) => void; setTracks: (t: Track[]) => void; setQueue: (q: QueueItem[]) => void }
const AppContext = createContext<AppState>({ route: 'home', tracks: [], queue: [], navigate: () => {}, setTracks: () => {}, setQueue: () => {} })
export function useApp() { return useContext(AppContext) }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route] = useState<Route>('home')
  return <AppContext.Provider value={{ route, tracks: [], queue: [], navigate: () => {}, setTracks: () => {}, setQueue: () => {} }}>{children}</AppContext.Provider>
}
