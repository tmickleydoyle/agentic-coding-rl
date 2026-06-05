'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import JobsPage from './jobs/page'
import CandidatesPage from './candidates/page'
import PipelinePage from './pipeline/page'
import JobDetailPage from './job-detail/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'jobs':
      return <JobsPage />
    case 'candidates':
      return <CandidatesPage />
    case 'pipeline':
      return <PipelinePage />
    case 'job-detail':
      return <JobDetailPage />
    default:
      return <JobsPage />
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
