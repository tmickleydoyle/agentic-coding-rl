'use client'
import { AppStateProvider, useCrm } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import LeadsPage from './leads/page'
import LeadDetailPage from './lead-detail/page'
import PropertiesPage from './properties/page'
import PipelinePage from './pipeline/page'

function ActivePage() {
  const { route } = useCrm()
  switch (route) {
    case 'leads':
      return <LeadsPage />
    case 'lead-detail':
      return <LeadDetailPage />
    case 'properties':
      return <PropertiesPage />
    case 'pipeline':
      return <PipelinePage />
    default:
      return <LeadsPage />
  }
}

function Shell() {
  const { theme } = useCrm()
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
