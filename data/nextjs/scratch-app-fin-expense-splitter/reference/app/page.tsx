'use client'
import { SplitProvider, useSplit } from '../components/SplitProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import ExpensesPage from './expenses/page'
import PeoplePage from './people/page'
import BalancesPage from './balances/page'

function ActivePage() {
  const { route } = useSplit()
  switch (route) {
    case 'dashboard':
      return <DashboardPage />
    case 'expenses':
      return <ExpensesPage />
    case 'people':
      return <PeoplePage />
    case 'balances':
      return <BalancesPage />
    default:
      return <DashboardPage />
  }
}

function Shell() {
  const { theme } = useSplit()
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
    <SplitProvider>
      <Shell />
    </SplitProvider>
  )
}
