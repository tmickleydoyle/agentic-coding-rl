'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import EventsPage from './events/page'
import InviteDetailPage from './invite-detail/page'
import CreatePage from './create/page'
import ResponsesPage from './responses/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'events':
      return <EventsPage />
    case 'invite-detail':
      return <InviteDetailPage />
    case 'create':
      return <CreatePage />
    case 'responses':
      return <ResponsesPage />
    default:
      return <EventsPage />
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
