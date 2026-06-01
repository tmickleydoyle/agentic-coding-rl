'use client'
import { WatchlistProvider, useWatchlist } from '../components/WatchlistProvider'
import NavBar from '../components/NavBar'
import WatchlistPage from './watchlist/page'
import TickerDetailPage from './ticker-detail/page'
import AddPage from './add/page'
import AlertsPage from './alerts/page'

function ActivePage() {
  const { route } = useWatchlist()
  switch (route) {
    case 'watchlist':
      return <WatchlistPage />
    case 'ticker-detail':
      return <TickerDetailPage />
    case 'add':
      return <AddPage />
    case 'alerts':
      return <AlertsPage />
    default:
      return <WatchlistPage />
  }
}

function Shell() {
  const { theme } = useWatchlist()
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
    <WatchlistProvider>
      <Shell />
    </WatchlistProvider>
  )
}
