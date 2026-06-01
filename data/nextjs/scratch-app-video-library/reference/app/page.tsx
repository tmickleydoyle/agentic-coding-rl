'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import BrowsePage from './browse/page'
import VideoDetailPage from './video-detail/page'
import WatchlistPage from './watchlist/page'
import HistoryPage from './history/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'browse':
      return <BrowsePage />
    case 'video-detail':
      return <VideoDetailPage />
    case 'watchlist':
      return <WatchlistPage />
    case 'history':
      return <HistoryPage />
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
