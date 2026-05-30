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
  // TODO: reflect theme as data-theme on app-root.
  return (
    <div data-testid="app-root">
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
