'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import RoomsPage from './rooms/page'
import RoomPage from './room/page'
import MembersPage from './members/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'rooms':
      return <RoomsPage />
    case 'room':
      return <RoomPage />
    case 'members':
      return <MembersPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <RoomsPage />
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
