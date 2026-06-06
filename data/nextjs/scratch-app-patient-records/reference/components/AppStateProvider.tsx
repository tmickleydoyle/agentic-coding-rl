'use client'
import React, { createContext, useContext, useState } from 'react'
import { AppState, Route } from '../lib/types'

const AppContext = createContext<AppState>({
  route: 'home',
  setRoute: () => {},
})

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home')
  return (
    <AppContext.Provider value={{ route, setRoute }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
