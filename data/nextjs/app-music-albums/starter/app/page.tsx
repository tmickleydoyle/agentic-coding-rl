'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import AlbumsPage from './albums/page'
import AlbumDetailPage from './album-detail/page'
import ArtistsPage from './artists/page'
import FavoritesPage from './favorites/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'albums':
      return <AlbumsPage />
    case 'album-detail':
      return <AlbumDetailPage />
    case 'artists':
      return <ArtistsPage />
    case 'favorites':
      return <FavoritesPage />
    default:
      return <AlbumsPage />
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
