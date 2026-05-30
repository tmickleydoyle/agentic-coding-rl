'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import StudentsPage from './students/page'
import AssignmentsPage from './assignments/page'
import GradebookPage from './gradebook/page'
import SummaryPage from './summary/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'students':
      return <StudentsPage />
    case 'assignments':
      return <AssignmentsPage />
    case 'gradebook':
      return <GradebookPage />
    case 'summary':
      return <SummaryPage />
    default:
      return <StudentsPage />
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
