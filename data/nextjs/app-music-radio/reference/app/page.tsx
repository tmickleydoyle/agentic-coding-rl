'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import StationsPage from './stations/page'
import StationDetailPage from './station-detail/page'
import FavoritesPage from './favorites/page'
import HistoryPage from './history/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'stations':
      return <StationsPage />
    case 'station-detail':
      return <StationDetailPage />
    case 'favorites':
      return <FavoritesPage />
    case 'history':
      return <HistoryPage />
    default:
      return <StationsPage />
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
