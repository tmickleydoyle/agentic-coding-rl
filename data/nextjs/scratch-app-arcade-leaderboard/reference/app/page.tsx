'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import GamesPage from './games/page'
import GameDetailPage from './game-detail/page'
import SubmitPage from './submit/page'
import RankingsPage from './rankings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'games':
      return <GamesPage />
    case 'game-detail':
      return <GameDetailPage />
    case 'submit':
      return <SubmitPage />
    case 'rankings':
      return <RankingsPage />
    default:
      return <GamesPage />
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
