'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { TicketsPage } from './tickets/page'
import { OrdersPage } from './orders/page'
import { ProfilePage } from './profile/page'

function Shell() {
  const { route } = useApp()
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, tickets: <TicketsPage />, orders: <OrdersPage />, profile: <ProfilePage />,
  }
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>
}
