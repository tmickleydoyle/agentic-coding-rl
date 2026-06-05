'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Ada Byron', company: 'Analytical' },
  { id: 'c2', name: 'Grace Hopper', company: 'Navy' },
  { id: 'c3', name: 'Linus T', company: 'Kernel' },
]

const SEED_DEALS: Deal[] = [
  { id: 'd1', title: 'Analytical license', value: 5000, stage: 'qualified', contactId: 'c1' },
  { id: 'd2', title: 'Navy rollout', value: 12000, stage: 'proposal', contactId: 'c2' },
  { id: 'd3', title: 'Kernel support', value: 8000, stage: 'won', contactId: 'c3' },
  { id: 'd4', title: 'Analytical addon', value: 3000, stage: 'lead', contactId: 'c1' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [contacts] = useState<Contact[]>(SEED_CONTACTS)
  const [deals, setDeals] = useState<Deal[]>(SEED_DEALS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('pipeline')
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<AppApi>(() => {
    const addDeal = (input: NewDealInput) => {
      const id = `d${nextId}`
      setNextId((n) => n + 1)
      setDeals((prev) => [
        ...prev,
        {
          id,
          title: input.title,
          value: input.value,
          stage: input.stage,
          contactId: input.contactId,
        },
      ])
    }

    const moveStage = (dealId: string, stage: Stage) => {
      setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage } : d)))
    }

    const selectDeal = (dealId: string) => {
      setSelectedDealId(dealId)
      setRoute('deal-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      contacts,
      deals,
      theme,
      route,
      selectedDealId,
      addDeal,
      moveStage,
      selectDeal,
      setTheme,
      navigate,
    }
  }, [contacts, deals, theme, route, selectedDealId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
