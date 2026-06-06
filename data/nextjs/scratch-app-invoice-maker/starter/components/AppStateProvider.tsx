'use client'
import React, { createContext, useContext, useState } from 'react'
import { Client, Invoice, Route } from '../lib/types'
interface AppState { route: Route; clients: Client[]; invoices: Invoice[]; navigate: (r: Route) => void; setClients: (c: Client[]) => void; setInvoices: (i: Invoice[]) => void }
const AppContext = createContext<AppState>({ route: 'home', clients: [], invoices: [], navigate: () => {}, setClients: () => {}, setInvoices: () => {} })
export function useApp() { return useContext(AppContext) }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route] = useState<Route>('home')
  return <AppContext.Provider value={{ route, clients: [], invoices: [], navigate: () => {}, setClients: () => {}, setInvoices: () => {} }}>{children}</AppContext.Provider>
}
