'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import QuotesPage from './quotes/page'
import QuoteDetailPage from './quote-detail/page'
import NewQuotePage from './new/page'
import AcceptedPage from './accepted/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'quotes':
      return <QuotesPage />
    case 'quote-detail':
      return <QuoteDetailPage />
    case 'new':
      return <NewQuotePage />
    case 'accepted':
      return <AcceptedPage />
    default:
      return <QuotesPage />
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
