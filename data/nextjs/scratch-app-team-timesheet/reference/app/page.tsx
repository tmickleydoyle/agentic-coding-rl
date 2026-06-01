'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import WeekPage from './week/page'
import LogEntryPage from './log-entry/page'
import ProjectsPage from './projects/page'
import ApprovalsPage from './approvals/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'week':
      return <WeekPage />
    case 'log-entry':
      return <LogEntryPage />
    case 'projects':
      return <ProjectsPage />
    case 'approvals':
      return <ApprovalsPage />
    default:
      return <WeekPage />
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
