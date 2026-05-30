'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import SchedulePage from './schedule/page'
import SessionDetailPage from './session-detail/page'
import MyAgendaPage from './my-agenda/page'
import SpeakersPage from './speakers/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'schedule':
      return <SchedulePage />
    case 'session-detail':
      return <SessionDetailPage />
    case 'my-agenda':
      return <MyAgendaPage />
    case 'speakers':
      return <SpeakersPage />
    default:
      return <SchedulePage />
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
