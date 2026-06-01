'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import PlayPage from './play/page'
import StatsPage from './stats/page'
import WordsPage from './words/page'
import HowToPage from './how-to/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'play':
      return <PlayPage />
    case 'stats':
      return <StatsPage />
    case 'words':
      return <WordsPage />
    case 'how-to':
      return <HowToPage />
    default:
      return <PlayPage />
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
