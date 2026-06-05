'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import FeedPage from './feed/page'
import ClipDetailPage from './clip-detail/page'
import SavedPage from './saved/page'
import CategoriesPage from './categories/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'feed':
      return <FeedPage />
    case 'clip-detail':
      return <ClipDetailPage />
    case 'saved':
      return <SavedPage />
    case 'categories':
      return <CategoriesPage />
    default:
      return <FeedPage />
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
