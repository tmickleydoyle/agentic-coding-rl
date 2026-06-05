'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import PipelinePage from './pipeline/page'
import DealDetailPage from './deal-detail/page'
import ContactsPage from './contacts/page'
import ForecastPage from './forecast/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'pipeline':
      return <PipelinePage />
    case 'deal-detail':
      return <DealDetailPage />
    case 'contacts':
      return <ContactsPage />
    case 'forecast':
      return <ForecastPage />
    default:
      return <PipelinePage />
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
