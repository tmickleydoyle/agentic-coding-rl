'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { InventoryPage } from './inventory/page'
import { LocationsPage } from './locations/page'
import { MovementsPage } from './movements/page'

function Shell() {
  const { route } = useApp()
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, inventory: <InventoryPage />, locations: <LocationsPage />, movements: <MovementsPage />,
  }
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>
}
