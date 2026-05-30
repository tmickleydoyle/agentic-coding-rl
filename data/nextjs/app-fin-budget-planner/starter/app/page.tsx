'use client'
import { BudgetProvider, useBudget } from '../components/BudgetProvider'
import NavBar from '../components/NavBar'
import OverviewPage from './overview/page'
import CategoriesPage from './categories/page'
import AddExpensePage from './add-expense/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useBudget()
  // TODO: render the page matching `route`.
  switch (route) {
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
    <BudgetProvider>
      <Shell />
    </BudgetProvider>
  )
}
