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
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  )
}
