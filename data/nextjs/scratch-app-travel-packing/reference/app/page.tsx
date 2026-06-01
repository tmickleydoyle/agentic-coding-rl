'use client'
import { PackingProvider, usePacking } from '../components/PackingProvider'
import NavBar from '../components/NavBar'
import TripsPage from './trips/page'
import ListPage from './list/page'
import AddItemPage from './add-item/page'
import SummaryPage from './summary/page'

function ActivePage() {
  const { route } = usePacking()
  switch (route) {
    case 'trips':
      return <TripsPage />
    case 'list':
      return <ListPage />
    case 'add-item':
      return <AddItemPage />
    case 'summary':
      return <SummaryPage />
    default:
      return <TripsPage />
  }
}

function Shell() {
  const { theme } = usePacking()
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
    <PackingProvider>
      <Shell />
    </PackingProvider>
  )
}
