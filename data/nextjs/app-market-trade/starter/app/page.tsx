'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ItemsPage from './items/page'
import DetailPage from './detail/page'
import OffersPage from './offers/page'
import MyTradesPage from './mytrades/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'items':
      return <ItemsPage />
    case 'detail':
      return <DetailPage />
    case 'offers':
      return <OffersPage />
    case 'mytrades':
      return <MyTradesPage />
    default:
      return <ItemsPage />
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
