'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import KeysPage from './keys/page'
import CreateKeyPage from './create-key/page'
import KeyDetailPage from './key-detail/page'
import UsagePage from './usage/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'keys':
      return <KeysPage />
    case 'create-key':
      return <CreateKeyPage />
    case 'key-detail':
      return <KeyDetailPage />
    case 'usage':
      return <UsagePage />
    default:
      return <KeysPage />
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
