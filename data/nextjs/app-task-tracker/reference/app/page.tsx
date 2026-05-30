'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import TasksPage from './tasks/page'
import NewTaskPage from './new/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'dashboard':
      return <DashboardPage />
    case 'tasks':
      return <TasksPage />
    case 'new':
      return <NewTaskPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <DashboardPage />
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
