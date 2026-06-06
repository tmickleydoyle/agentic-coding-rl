'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from '../app/home/page'
import { GoalsPage } from '../app/goals/page'
import { BudgetPage } from '../app/budget/page'
import { ReportsPage } from '../app/reports/page'

function Shell() {
  const { route } = useApp()
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    goals: <GoalsPage />,
    budget: <BudgetPage />,
    reports: <ReportsPage />,
  }
  return (
    <div data-theme="light">
      <NavBar />
      {pages[route] ?? <HomePage />}
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  )
}
