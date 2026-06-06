'use client'
import React, { createContext, useContext, useState } from 'react'
import { Track, QueueItem, Route } from '../lib/types'

interface AppState {
  route: Route
  tracks: Track[]
  queue: QueueItem[]
  navigate: (r: Route) => void
  setTracks: (t: Track[]) => void
  setQueue: (q: QueueItem[]) => void
}

const AppContext = createContext<AppState>({
  route: 'home', tracks: [], queue: [],
  navigate: () => {}, setTracks: () => {}, setQueue: () => {},
})

export function useApp() { return useContext(AppContext) }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home')
  const [tracks, setTracks] = useState<Track[]>([
    { id: 't1', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: 354 },
    { id: 't2', title: 'Under Pressure', artist: 'Queen', album: 'Hot Space', duration: 248 },
    { id: 't3', title: 'Heroes', artist: 'David Bowie', album: 'Heroes', duration: 370 },
    { id: 't4', title: "Let's Dance", artist: 'David Bowie', album: "Let's Dance", duration: 458 },
    { id: 't5', title: 'Roxanne', artist: 'The Police', album: "Outlandos d'Amour", duration: 190 },
  ])
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: 'q1', trackId: 't1' },
    { id: 'q2', trackId: 't3' },
  ])

  return (
    <AppContext.Provider value={{ route, tracks, queue, navigate: setRoute, setTracks, setQueue }}>
      {children}
    </AppContext.Provider>
  )
}
