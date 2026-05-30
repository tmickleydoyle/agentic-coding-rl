'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import OverviewPage from './overview/page'
import ProductsPage from './products/page'
import RegionsPage from './regions/page'
import TrendsPage from './trends/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'overview':
      return <OverviewPage />
    case 'products':
      return <ProductsPage />
    case 'regions':
      return <RegionsPage />
    case 'trends':
      return <TrendsPage />
    default:
      return <OverviewPage />
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
