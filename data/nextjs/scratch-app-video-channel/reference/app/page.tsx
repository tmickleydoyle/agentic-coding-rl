'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ChannelPage from './channel/page'
import VideoDetailPage from './video-detail/page'
import UploadsPage from './uploads/page'
import SubscriptionsPage from './subscriptions/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'channel':
      return <ChannelPage />
    case 'video-detail':
      return <VideoDetailPage />
    case 'uploads':
      return <UploadsPage />
    case 'subscriptions':
      return <SubscriptionsPage />
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
