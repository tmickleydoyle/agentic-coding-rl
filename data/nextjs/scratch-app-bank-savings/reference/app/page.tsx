'use client'
import { SavingsProvider, useSavings } from '../components/SavingsProvider'
import NavBar from '../components/NavBar'
import PotsPage from './pots/page'
import PotDetailPage from './pot-detail/page'
import CreatePage from './create/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useSavings()
  switch (route) {
    case 'pots':
      return <PotsPage />
    case 'pot-detail':
      return <PotDetailPage />
    case 'create':
      return <CreatePage />
    case 'settings':
      return <SettingsPage />
    default:
      return <PotsPage />
  }
}

function Shell() {
  const { theme } = useSavings()
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
    <SavingsProvider>
      <Shell />
    </SavingsProvider>
  )
}
