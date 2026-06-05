'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import DecksPage from './decks/page'
import StudyPage from './study/page'
import AddPage from './add/page'
import StatsPage from './stats/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'decks':
      return <DecksPage />
    case 'study':
      return <StudyPage />
    case 'add':
      return <AddPage />
    case 'stats':
      return <StatsPage />
    default:
      return <DecksPage />
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
