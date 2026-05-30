'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import OverviewPage from './overview/page'
import ProductsPage from './products/page'
import RegionsPage from './regions/page'
import TrendsPage from './trends/page'

function ActivePage() {
  const { route } = useApp()
  // TODO: render the page matching `route`.
  switch (route) {
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
  // TODO: reflect theme as data-theme on app-root.
  return (
    <div data-testid="app-root">
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
