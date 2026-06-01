'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ProfilePage from './profile/page'
import PostsPage from './posts/page'
import ConnectionsPage from './connections/page'
import EditPage from './edit/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'profile':
      return <ProfilePage />
    case 'posts':
      return <PostsPage />
    case 'connections':
      return <ConnectionsPage />
    case 'edit':
      return <EditPage />
    default:
      return <ProfilePage />
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
