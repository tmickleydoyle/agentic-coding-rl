'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

// Deterministic mock open rate: half the recipients open, rounded.
function mockOpens(recipients: number): number {
  return Math.round(recipients * 0.5)
}

const SEED_CAMPAIGNS: Campaign[] = [
  { id: 'm1', subject: 'Welcome', body: 'Hi there', status: 'sent', recipients: 4, opens: 2 },
  { id: 'm2', subject: 'Weekly Digest', body: 'News', status: 'draft', recipients: 0, opens: 0 },
]

const SEED_SUBSCRIBERS: Subscriber[] = [
  { id: 's1', email: 'ada@example.com', active: true },
  { id: 's2', email: 'lin@example.com', active: true },
  { id: 's3', email: 'old@example.com', active: false },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS)
  const [subscribers, setSubscribers] = useState<Subscriber[]>(SEED_SUBSCRIBERS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('dashboard')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [nextCampaignId, setNextCampaignId] = useState(3)
  const [nextSubscriberId, setNextSubscriberId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const activeCount = subscribers.filter((s) => s.active).length

    const addCampaign = (input: { subject: string; body?: string }) => {
      const id = `m${nextCampaignId}`
      setNextCampaignId((n) => n + 1)
      setCampaigns((prev) => [
        ...prev,
        {
          id,
          subject: input.subject,
          body: input.body ?? '',
          status: 'draft',
          recipients: 0,
          opens: 0,
        },
      ])
    }

    const sendCampaign = (id: string) => {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'sent',
                recipients: activeCount,
                opens: mockOpens(activeCount),
              }
            : c,
        ),
      )
    }

    const removeCampaign = (id: string) => {
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
    }

    const addSubscriber = (email: string) => {
      const id = `s${nextSubscriberId}`
      setNextSubscriberId((n) => n + 1)
      setSubscribers((prev) => [...prev, { id, email, active: true }])
    }

    const toggleSubscriber = (id: string) => {
      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      campaigns,
      subscribers,
      theme,
      route,
      statusFilter,
      addCampaign,
      sendCampaign,
      removeCampaign,
      addSubscriber,
      toggleSubscriber,
      setStatusFilter,
      setTheme,
      navigate,
    }
  }, [campaigns, subscribers, theme, route, statusFilter, nextCampaignId, nextSubscriberId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
