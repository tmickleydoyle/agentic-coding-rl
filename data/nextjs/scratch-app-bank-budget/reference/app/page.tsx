'use client'
import { BudgetProvider, useBudget } from '../components/BudgetProvider'
import NavBar from '../components/NavBar'
import OverviewPage from './overview/page'
import CategoriesPage from './categories/page'
import TransactionsPage from './transactions/page'
import BudgetsPage from './budgets/page'

function ActivePage() {
  const { route } = useBudget()
  switch (route) {
    case 'overview':
      return <OverviewPage />
    case 'categories':
      return <CategoriesPage />
    case 'transactions':
      return <TransactionsPage />
    case 'budgets':
      return <BudgetsPage />
    default:
      return <OverviewPage />
  }
}

function Shell() {
  const { theme } = useBudget()
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
    <BudgetProvider>
      <Shell />
    </BudgetProvider>
  )
}
