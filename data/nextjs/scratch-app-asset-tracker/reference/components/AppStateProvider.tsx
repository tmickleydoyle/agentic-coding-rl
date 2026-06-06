'use client'
import React, { createContext, useContext, useState } from 'react'
import { Asset, Route } from '../lib/types'

interface AppState {
  route: Route
  assets: Asset[]
  navigate: (r: Route) => void
  setAssets: (a: Asset[]) => void
}

const AppContext = createContext<AppState>({
  route: 'home', assets: [], navigate: () => {}, setAssets: () => {},
})

export function useApp() { return useContext(AppContext) }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home')
  const [assets, setAssets] = useState<Asset[]>([
    { id: 'a1', name: 'MacBook Pro', category: 'Electronics', purchasePrice: 3000, purchaseYear: 2024, depreciationRate: 25 },
    { id: 'a2', name: 'Office Desk', category: 'Furniture', purchasePrice: 800, purchaseYear: 2022, depreciationRate: 10 },
    { id: 'a3', name: 'Company Car', category: 'Vehicles', purchasePrice: 30000, purchaseYear: 2023, depreciationRate: 15 },
    { id: 'a4', name: 'Laptop Stand', category: 'Electronics', purchasePrice: 150, purchaseYear: 2025, depreciationRate: 25 },
  ])

  return (
    <AppContext.Provider value={{ route, assets, navigate: setRoute, setAssets }}>
      {children}
    </AppContext.Provider>
  )
}
