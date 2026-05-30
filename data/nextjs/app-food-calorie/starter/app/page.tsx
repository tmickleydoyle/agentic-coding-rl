'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import HistoryPage from './history/page'
import AddMealPage from './add-meal/page'
import GoalsPage from './goals/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'history':
      return <HistoryPage />
    case 'add-meal':
      return <AddMealPage />
    case 'goals':
      return <GoalsPage />
    default:
      return <TodayPage />
  }
}

function Shell() {
  // TODO: reflect theme as data-theme on app-root.
  return (
    <div data-testid="app-root">
      <NavBar />
      <main data-testid="page-content">
        <ActivePage />
      </main>
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
