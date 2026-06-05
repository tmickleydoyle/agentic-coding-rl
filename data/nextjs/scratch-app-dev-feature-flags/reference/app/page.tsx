'use client'
import { AppStateProvider, useFlags } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import FlagsPage from './flags/page'
import FlagDetailPage from './flag-detail/page'
import EnvironmentsPage from './environments/page'
import AuditPage from './audit/page'

function ActivePage() {
  const { route } = useFlags()
  switch (route) {
    case 'flags':
      return <FlagsPage />
    case 'flag-detail':
      return <FlagDetailPage />
    case 'environments':
      return <EnvironmentsPage />
    case 'audit':
      return <AuditPage />
    default:
      return <FlagsPage />
  }
}

function Shell() {
  const { theme } = useFlags()
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
