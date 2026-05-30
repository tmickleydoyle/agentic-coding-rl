'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import HistoryPage from './history/page'
import TeamPage from './team/page'
import AddEntryPage from './add-entry/page'

function ActivePage() {
  const { route } = useApp()
  // TODO: render the page matching `route`.
  switch (route) {
    case 'history':
      return <HistoryPage />
    case 'team':
      return <TeamPage />
    case 'add-entry':
      return <AddEntryPage />
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
