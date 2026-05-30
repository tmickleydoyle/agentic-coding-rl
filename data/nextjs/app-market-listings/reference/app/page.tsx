'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import BrowsePage from './browse/page'
import DetailPage from './detail/page'
import PostPage from './post/page'
import FavoritesPage from './favorites/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'browse':
      return <BrowsePage />
    case 'detail':
      return <DetailPage />
    case 'post':
      return <PostPage />
    case 'favorites':
      return <FavoritesPage />
    default:
      return <BrowsePage />
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
