'use client'
import { ExpensesProvider, useExpenses } from '../components/ExpensesProvider'
import NavBar from '../components/NavBar'
import TripsPage from './trips/page'
import ExpensesPage from './expenses/page'
import AddPage from './add/page'
import SummaryPage from './summary/page'

function ActivePage() {
  const { route } = useExpenses()
  switch (route) {
    case 'trips':
      return <TripsPage />
    case 'expenses':
      return <ExpensesPage />
    case 'add':
      return <AddPage />
    case 'summary':
      return <SummaryPage />
    default:
      return <TripsPage />
  }
}

function Shell() {
  const { theme } = useExpenses()
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
    <ExpensesProvider>
      <Shell />
    </ExpensesProvider>
  )
}
