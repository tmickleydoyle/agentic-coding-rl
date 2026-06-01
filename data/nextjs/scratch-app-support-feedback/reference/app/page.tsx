'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import InboxPage from './inbox/page'
import ItemDetailPage from './item-detail/page'
import CategoriesPage from './categories/page'
import StatsPage from './stats/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'inbox':
      return <InboxPage />
    case 'item-detail':
      return <ItemDetailPage />
    case 'categories':
      return <CategoriesPage />
    case 'stats':
      return <StatsPage />
    default:
      return <InboxPage />
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
