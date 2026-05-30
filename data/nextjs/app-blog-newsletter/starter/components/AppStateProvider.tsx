'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type {
  Campaign,
  Route,
  StatusFilter,
  Subscriber,
  Theme,
} from '../lib/types'

type AppApi = {
  campaigns: Campaign[]
  subscribers: Subscriber[]
  theme: Theme
  route: Route
  statusFilter: StatusFilter
  addCampaign: (input: { subject: string; body?: string }) => void
  sendCampaign: (id: string) => void
  removeCampaign: (id: string) => void
  addSubscriber: (email: string) => void
  toggleSubscriber: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  campaigns: [],
  subscribers: [],
  theme: 'light',
  route: 'dashboard',
  statusFilter: 'all',
  addCampaign: () => {},
  sendCampaign: () => {},
  removeCampaign: () => {},
  addSubscriber: () => {},
  toggleSubscriber: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold campaigns/subscribers/theme/route/statusFilter in state (seed 2 campaigns +
  // 3 subscribers), implement addCampaign/sendCampaign (mock open rate = round(recipients*0.5))/
  // removeCampaign/addSubscriber/toggleSubscriber + setters + navigate, and provide them through
  // AppContext. The STUB makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
