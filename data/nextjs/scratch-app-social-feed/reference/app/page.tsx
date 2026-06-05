'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import FeedPage from './feed/page'
import PostPage from './post/page'
import ProfilePage from './profile/page'
import ExplorePage from './explore/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'feed':
      return <FeedPage />
    case 'post':
      return <PostPage />
    case 'profile':
      return <ProfilePage />
    case 'explore':
      return <ExplorePage />
    default:
      return <FeedPage />
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
