'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import PollsPage from './polls/page'
import PollPage from './poll/page'
import CreatePage from './create/page'
import TrendingPage from './trending/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'polls':
      return <PollsPage />
    case 'poll':
      return <PollPage />
    case 'create':
      return <CreatePage />
    case 'trending':
      return <TrendingPage />
    default:
      return <PollsPage />
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
