'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import EntriesPage from './entries/page'
import NewEntryPage from './new/page'
import InsightsPage from './insights/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'today':
      return <TodayPage />
    case 'entries':
      return <EntriesPage />
    case 'new':
      return <NewEntryPage />
    case 'insights':
      return <InsightsPage />
    default:
      return <TodayPage />
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
