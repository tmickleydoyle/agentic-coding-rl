'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import LibraryPage from './library/page'
import PlaylistPage from './playlist/page'
import QueuePage from './queue/page'
import SearchPage from './search/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'library':
      return <LibraryPage />
    case 'playlist':
      return <PlaylistPage />
    case 'queue':
      return <QueuePage />
    case 'search':
      return <SearchPage />
    default:
      return <LibraryPage />
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
