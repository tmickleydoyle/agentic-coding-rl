'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import MonthPage from './month/page'
import EventDetailPage from './event-detail/page'
import CreatePage from './create/page'
import CategoriesPage from './categories/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'month':
      return <MonthPage />
    case 'event-detail':
      return <EventDetailPage />
    case 'create':
      return <CreatePage />
    case 'categories':
      return <CategoriesPage />
    default:
      return <MonthPage />
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
