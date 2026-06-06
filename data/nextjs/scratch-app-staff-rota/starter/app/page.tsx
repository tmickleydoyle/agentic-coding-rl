'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { ShiftsPage } from './shifts/page'
import { StaffPage } from './staff/page'
import { RequestsPage } from './requests/page'

function Shell() {
  const { route } = useApp()
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, shifts: <ShiftsPage />, staff: <StaffPage />, requests: <RequestsPage />,
  }
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>
}
