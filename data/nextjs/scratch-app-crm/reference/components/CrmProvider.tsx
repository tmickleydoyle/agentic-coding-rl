'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Contact, Route, Stage } from '../lib/types'

const ORDER: Stage[] = ['lead', 'qualified', 'won']

type Ctx = {
  contacts: Contact[]
  theme: 'light' | 'dark'
  showWon: boolean
  route: Route
  navigate: (r: Route) => void
  addContact: (name: string, company: string, amount: string) => void
  moveStage: (id: number, delta: number) => void
  toggleTheme: () => void
  toggleShowWon: () => void
}

export const CrmContext = createContext<Ctx | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showWon, setShowWon] = useState(true)
  const [route, setRoute] = useState<Route>('contacts')
  const [nextId, setNextId] = useState(1)

  function addContact(name: string, company: string, amount: string) {
    const n = name.trim()
    if (!n) return
    const amt = parseFloat(amount)
    setContacts((c) => [
      ...c,
      { id: nextId, name: n, company: company.trim(), amount: isFinite(amt) ? amt : 0, stage: 'lead' },
    ])
    setNextId((x) => x + 1)
  }
  function moveStage(id: number, delta: number) {
    setContacts((cs) =>
      cs.map((c) => {
        if (c.id !== id) return c
        const idx = Math.max(0, Math.min(ORDER.length - 1, ORDER.indexOf(c.stage) + delta))
        return { ...c, stage: ORDER[idx] }
      }),
    )
  }

  const value: Ctx = {
    contacts,
    theme,
    showWon,
    route,
    navigate: setRoute,
    addContact,
    moveStage,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleShowWon: () => setShowWon((s) => !s),
  }
  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}
