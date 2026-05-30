'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import SnippetsPage from './snippets/page'
import DetailPage from './detail/page'
import AddPage from './add/page'
import FavoritesPage from './favorites/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'detail':
      return <DetailPage />
    case 'add':
      return <AddPage />
    case 'favorites':
      return <FavoritesPage />
    default:
      return <SnippetsPage />
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
