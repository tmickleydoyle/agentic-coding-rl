'use client'
import { RecurringProvider, useRecurring } from '../components/RecurringProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import AllTasksPage from './all-tasks/page'
import AddPage from './add/page'
import HistoryPage from './history/page'

function ActivePage() {
  const { route } = useRecurring()
  switch (route) {
    case 'today':
      return <TodayPage />
    case 'all-tasks':
      return <AllTasksPage />
    case 'add':
      return <AddPage />
    case 'history':
      return <HistoryPage />
    default:
      return <TodayPage />
  }
}

function Shell() {
  const { theme } = useRecurring()
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
    <RecurringProvider>
      <Shell />
    </RecurringProvider>
  )
}
