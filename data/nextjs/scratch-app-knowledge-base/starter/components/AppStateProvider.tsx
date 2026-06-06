'use client'
import React, { createContext, useContext } from 'react'
import { AppState, Route } from '../lib/types'
const AppContext = createContext<AppState>({ route: 'home', setRoute: (_r: Route) => {} })
export function AppStateProvider({ children }: { children: React.ReactNode }) { return <AppContext.Provider value={{ route: 'home', setRoute: () => {} }}>{children}</AppContext.Provider> }
export function useApp() { return useContext(AppContext) }
