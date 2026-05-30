'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import QueuePage from './queue/page'
import ChatPage from './chat/page'
import CannedPage from './canned/page'
import HistoryPage from './history/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'queue':
      return <QueuePage />
    case 'chat':
      return <ChatPage />
    case 'canned':
      return <CannedPage />
    case 'history':
      return <HistoryPage />
    default:
      return <QueuePage />
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
