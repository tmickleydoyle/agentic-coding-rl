'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import PostsPage from './posts/page'
import PostDetailPage from './post-detail/page'
import ModerationPage from './moderation/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'posts':
      return <PostsPage />
    case 'post-detail':
      return <PostDetailPage />
    case 'moderation':
      return <ModerationPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <PostsPage />
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
