'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import PipelinesPage from './pipelines/page'
import PipelineDetailPage from './pipeline-detail/page'
import BuildsPage from './builds/page'
import StatsPage from './stats/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'pipelines':
      return <PipelinesPage />
    case 'pipeline-detail':
      return <PipelineDetailPage />
    case 'builds':
      return <BuildsPage />
    case 'stats':
      return <StatsPage />
    default:
      return <PipelinesPage />
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
