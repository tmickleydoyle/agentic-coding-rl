'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Contact, Deal, Route, Stage, Theme } from '../lib/types'

type NewDealInput = {
  title: string
  value: number
  stage: Stage
  contactId: string
}

type AppApi = {
  contacts: Contact[]
  deals: Deal[]
  theme: Theme
  route: Route
  selectedDealId: string | null
  addDeal: (input: NewDealInput) => void
  moveStage: (dealId: string, stage: Stage) => void
  selectDeal: (dealId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  contacts: [],
  deals: [],
  theme: 'light',
  route: 'pipeline',
  selectedDealId: null,
  addDeal: () => {},
  moveStage: () => {},
  selectDeal: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold contacts/deals/theme/route/selectedDealId in state (seed 3 contacts + 4
  // deals), implement the actions, and provide them through AppContext. The STUB below
  // makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
