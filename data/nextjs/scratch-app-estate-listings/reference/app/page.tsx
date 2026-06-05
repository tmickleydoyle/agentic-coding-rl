'use client'
import { AppStateProvider, useEstate } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ListingsPage from './listings/page'
import PropertyDetailPage from './property-detail/page'
import FavoritesPage from './favorites/page'
import FiltersPage from './filters/page'

function ActivePage() {
  const { route } = useEstate()
  switch (route) {
    case 'listings':
      return <ListingsPage />
    case 'property-detail':
      return <PropertyDetailPage />
    case 'favorites':
      return <FavoritesPage />
    case 'filters':
      return <FiltersPage />
    default:
      return <ListingsPage />
  }
}

function Shell() {
  const { theme } = useEstate()
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
