'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ListPage from './list/page'
import DestinationDetailPage from './destination-detail/page'
import AddDestinationPage from './add/page'
import VisitedPage from './visited/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'list':
      return <ListPage />
    case 'destination-detail':
      return <DestinationDetailPage />
    case 'add':
      return <AddDestinationPage />
    case 'visited':
      return <VisitedPage />
    default:
      return <ListPage />
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
