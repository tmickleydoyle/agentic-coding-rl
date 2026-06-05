'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import SeriesPage from './series/page'
import SeriesDetailPage from './series-detail/page'
import ReaderPage from './reader/page'
import AddPartPage from './add-part/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'series':
      return <SeriesPage />
    case 'series-detail':
      return <SeriesDetailPage />
    case 'reader':
      return <ReaderPage />
    case 'add-part':
      return <AddPartPage />
    default:
      return <SeriesPage />
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
