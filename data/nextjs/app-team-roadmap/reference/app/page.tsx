'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import RoadmapPage from './roadmap/page'
import InitiativeDetailPage from './initiative-detail/page'
import AddPage from './add/page'
import TimelinePage from './timeline/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'roadmap':
      return <RoadmapPage />
    case 'initiative-detail':
      return <InitiativeDetailPage />
    case 'add':
      return <AddPage />
    case 'timeline':
      return <TimelinePage />
    default:
      return <RoadmapPage />
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
