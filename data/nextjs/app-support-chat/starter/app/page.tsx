'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import QueuePage from './queue/page'
import SessionPage from './session/page'
import HistoryPage from './history/page'
import AgentsPage from './agents/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'queue':
      return <QueuePage />
    case 'session':
      return <SessionPage />
    case 'history':
      return <HistoryPage />
    case 'agents':
      return <AgentsPage />
    default:
      return <QueuePage />
  }
}

function Shell() {
  const { theme } = useApp()
  return (
    <div data-testid="app-root" data-theme={theme}>
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
