'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import PlayPage from './play/page'
import ResultsPage from './results/page'
import LeaderboardPage from './leaderboard/page'
import CategoriesPage from './categories/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'play':
      return <PlayPage />
    case 'results':
      return <ResultsPage />
    case 'leaderboard':
      return <LeaderboardPage />
    case 'categories':
      return <CategoriesPage />
    default:
      return <CategoriesPage />
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
