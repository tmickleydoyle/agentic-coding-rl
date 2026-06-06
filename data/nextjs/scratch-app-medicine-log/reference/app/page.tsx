'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { MedicinesPage } from './medicines/page'
import { LogPage } from './log/page'
import { SchedulePage } from './schedule/page'

function Shell() {
  const { route } = useApp()
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    medicines: <MedicinesPage />,
    log: <LogPage />,
    schedule: <SchedulePage />,
  }
  return (
    <div data-theme="light">
      <NavBar />
      {pages[route] ?? <HomePage />}
    </div>
  )
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>
}
