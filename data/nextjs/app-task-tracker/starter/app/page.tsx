'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import TasksPage from './tasks/page'
import NewTaskPage from './new/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  // TODO: render the page matching `route`.
  switch (route) {
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
