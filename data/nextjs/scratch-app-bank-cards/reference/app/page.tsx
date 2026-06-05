'use client'
import { CardsProvider, useCards } from '../components/CardsProvider'
import NavBar from '../components/NavBar'
import CardsPage from './cards/page'
import CardDetailPage from './card-detail/page'
import TransactionsPage from './transactions/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useCards()
  switch (route) {
    case 'cards':
      return <CardsPage />
    case 'card-detail':
      return <CardDetailPage />
    case 'transactions':
      return <TransactionsPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <CardsPage />
  }
}

function Shell() {
  const { theme } = useCards()
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
    <CardsProvider>
      <Shell />
    </CardsProvider>
  )
}
