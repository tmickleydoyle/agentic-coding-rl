'use client'
import React, { createContext, useContext, useState } from 'react'
import { Route } from '../lib/types'

interface AppState {
  route: Route
  navigate: (r: Route) => void
  refresh: number
  triggerRefresh: () => void
}

const AppContext = createContext<AppState>({
  route: 'home',
  navigate: () => {},
  refresh: 0,
  triggerRefresh: () => {},
})

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home')
  const [refresh, setRefresh] = useState(0)
  return (
    <AppContext.Provider value={{ route, navigate: setRoute, refresh, triggerRefresh: () => setRefresh(n => n + 1) }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
