'use client'
import { AppStateProvider, usePlan } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import WeekPage from './week/page'
import DayDetailPage from './day-detail/page'
import RecipesPage from './recipes/page'
import GroceryPage from './grocery/page'

function ActivePage() {
  const { route } = usePlan()
  switch (route) {
    case 'week':
      return <WeekPage />
    case 'day-detail':
      return <DayDetailPage />
    case 'recipes':
      return <RecipesPage />
    case 'grocery':
      return <GroceryPage />
    default:
      return <WeekPage />
  }
}

function Shell() {
  const { theme } = usePlan()
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
