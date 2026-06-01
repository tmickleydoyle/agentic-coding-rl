'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import LeadsPage from './leads/page'
import LeadDetailPage from './lead-detail/page'
import QualifyPage from './qualify/page'
import ConvertedPage from './converted/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'leads':
      return <LeadsPage />
    case 'lead-detail':
      return <LeadDetailPage />
    case 'qualify':
      return <QualifyPage />
    case 'converted':
      return <ConvertedPage />
    default:
      return <LeadsPage />
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
