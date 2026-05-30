'use client'
import { AppStateProvider, useDeployments } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import DeploymentsPage from './deployments/page'
import DeployDetailPage from './deploy-detail/page'
import EnvironmentsPage from './environments/page'
import StatsPage from './stats/page'

function ActivePage() {
  const { route } = useDeployments()
  switch (route) {
    case 'deployments':
      return <DeploymentsPage />
    case 'deploy-detail':
      return <DeployDetailPage />
    case 'environments':
      return <EnvironmentsPage />
    case 'stats':
      return <StatsPage />
    default:
      return <DeploymentsPage />
  }
}

function Shell() {
  const { theme } = useDeployments()
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
