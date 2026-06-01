'use client'
import { AppStateProvider, useShopping } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ListPage from './list/page'
import AddPage from './add/page'
import AislesPage from './aisles/page'
import HistoryPage from './history/page'

function ActivePage() {
  const { route } = useShopping()
  switch (route) {
    case 'list':
      return <ListPage />
    case 'add':
      return <AddPage />
    case 'aisles':
      return <AislesPage />
    case 'history':
      return <HistoryPage />
    default:
      return <ListPage />
  }
}

function Shell() {
  const { theme } = useShopping()
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
