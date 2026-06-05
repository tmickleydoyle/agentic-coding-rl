'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import PartiesPage from './parties/page'
import PartyDetailPage from './party-detail/page'
import CreatePage from './create/page'
import MyPartiesPage from './my-parties/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'parties':
      return <PartiesPage />
    case 'party-detail':
      return <PartyDetailPage />
    case 'create':
      return <CreatePage />
    case 'my-parties':
      return <MyPartiesPage />
    default:
      return <PartiesPage />
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
