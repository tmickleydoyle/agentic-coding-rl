'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import InboxPage from './inbox/page'
import ThreadPage from './thread/page'
import PeoplePage from './people/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'inbox':
      return <InboxPage />
    case 'thread':
      return <ThreadPage />
    case 'people':
      return <PeoplePage />
    case 'settings':
      return <SettingsPage />
    default:
      return <InboxPage />
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
