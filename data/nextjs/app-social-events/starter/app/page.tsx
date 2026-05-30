'use client'
import { AppStateProvider, useEvents } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import EventsPage from './events/page'
import EventDetailPage from './event-detail/page'
import CreatePage from './create/page'
import MyEventsPage from './my-events/page'

function ActivePage() {
  const { route } = useEvents()
  switch (route) {
    case 'events':
      return <EventsPage />
    case 'event-detail':
      return <EventDetailPage />
    case 'create':
      return <CreatePage />
    case 'my-events':
      return <MyEventsPage />
    default:
      return <EventsPage />
  }
}

function Shell() {
  const { theme } = useEvents()
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
