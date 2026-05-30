'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import RoadmapPage from './roadmap/page'
import InitiativeDetailPage from './initiative-detail/page'
import AddPage from './add/page'
import TimelinePage from './timeline/page'

function ActivePage() {
  const { route } = useApp()
  // TODO: render the page matching `route`.
  switch (route) {
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
