'use client'
import React, { createContext, useContext, useState } from 'react'
import { Asset, Route } from '../lib/types'
interface AppState { route: Route; assets: Asset[]; navigate: (r: Route) => void; setAssets: (a: Asset[]) => void }
const AppContext = createContext<AppState>({ route: 'home', assets: [], navigate: () => {}, setAssets: () => {} })
export function useApp() { return useContext(AppContext) }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route] = useState<Route>('home')
  return <AppContext.Provider value={{ route, assets: [], navigate: () => {}, setAssets: () => {} }}>{children}</AppContext.Provider>
}
