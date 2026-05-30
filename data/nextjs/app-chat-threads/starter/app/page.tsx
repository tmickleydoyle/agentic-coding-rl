'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ChannelPage from './channel/page'
import ThreadPage from './thread/page'
import SearchPage from './search/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'channel':
      return <ChannelPage />
    case 'thread':
      return <ThreadPage />
    case 'search':
      return <SearchPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <ChannelPage />
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
