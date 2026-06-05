'use client'
import { PomodoroProvider, usePomodoro } from '../components/PomodoroProvider'
import NavBar from '../components/NavBar'
import TasksPage from './tasks/page'
import FocusPage from './focus/page'
import StatsPage from './stats/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = usePomodoro()
  switch (route) {
    case 'tasks':
      return <TasksPage />
    case 'focus':
      return <FocusPage />
    case 'stats':
      return <StatsPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <TasksPage />
  }
}

function Shell() {
  const { theme } = usePomodoro()
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
    <PomodoroProvider>
      <Shell />
    </PomodoroProvider>
  )
}
