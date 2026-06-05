'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ListPage from './list/page'
import EditorPage from './editor/page'
import TagsPage from './tags/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'list':
      return <ListPage />
    case 'editor':
      return <EditorPage />
    case 'tags':
      return <TagsPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <ListPage />
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
