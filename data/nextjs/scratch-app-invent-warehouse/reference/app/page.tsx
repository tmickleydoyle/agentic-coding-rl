'use client'
import { AppStateProvider, useWarehouse } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import BinsPage from './bins/page'
import BinDetailPage from './bin-detail/page'
import MovePage from './move/page'
import MapPage from './map/page'

function ActivePage() {
  const { route } = useWarehouse()
  switch (route) {
    case 'bin-detail':
      return <BinDetailPage />
    case 'move':
      return <MovePage />
    case 'map':
      return <MapPage />
    default:
      return <BinsPage />
  }
}

function Shell() {
  const { theme } = useWarehouse()
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
