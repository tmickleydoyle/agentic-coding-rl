'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import TasksPage from './tasks/page'
import ContactsPage from './contacts/page'
import DonePage from './done/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'today':
      return <TodayPage />
    case 'tasks':
      return <TasksPage />
    case 'contacts':
      return <ContactsPage />
    case 'done':
      return <DonePage />
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
