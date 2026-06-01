'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ListsPage from './lists/page'
import PracticePage from './practice/page'
import AddWordPage from './add-word/page'
import ProgressPage from './progress/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'lists':
      return <ListsPage />
    case 'practice':
      return <PracticePage />
    case 'add-word':
      return <AddWordPage />
    case 'progress':
      return <ProgressPage />
    default:
      return <ListsPage />
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
