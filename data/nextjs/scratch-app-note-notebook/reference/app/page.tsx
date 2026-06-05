'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import NotebooksPage from './notebooks/page'
import NotesPage from './notes/page'
import EditorPage from './editor/page'
import SearchPage from './search/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'notebooks':
      return <NotebooksPage />
    case 'notes':
      return <NotesPage />
    case 'editor':
      return <EditorPage />
    case 'search':
      return <SearchPage />
    default:
      return <NotebooksPage />
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
