'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import SongsPage from './songs/page'
import SongDetailPage from './song-detail/page'
import SearchPage from './search/page'
import FavoritesPage from './favorites/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'songs':
      return <SongsPage />
    case 'song-detail':
      return <SongDetailPage />
    case 'search':
      return <SearchPage />
    case 'favorites':
      return <FavoritesPage />
    default:
      return <SongsPage />
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
