'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ChatsPage from './chats/page'
import ChatDetailPage from './chat-detail/page'
import MembersPage from './members/page'
import CreatePage from './create/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'chats':
      return <ChatsPage />
    case 'chat-detail':
      return <ChatDetailPage />
    case 'members':
      return <MembersPage />
    case 'create':
      return <CreatePage />
    default:
      return <ChatsPage />
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
