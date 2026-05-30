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
