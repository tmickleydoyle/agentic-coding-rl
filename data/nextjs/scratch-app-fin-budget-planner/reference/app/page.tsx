'use client'
import { BudgetProvider, useBudget } from '../components/BudgetProvider'
import NavBar from '../components/NavBar'
import OverviewPage from './overview/page'
import CategoriesPage from './categories/page'
import AddExpensePage from './add-expense/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useBudget()
  switch (route) {
    case 'overview':
      return <OverviewPage />
    case 'categories':
      return <CategoriesPage />
    case 'add-expense':
      return <AddExpensePage />
    case 'settings':
      return <SettingsPage />
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
