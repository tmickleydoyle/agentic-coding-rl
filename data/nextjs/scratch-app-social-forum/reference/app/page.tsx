'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ThreadsPage from './threads/page'
import ThreadPage from './thread/page'
import NewThreadPage from './new/page'
import CategoriesPage from './categories/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'threads':
      return <ThreadsPage />
    case 'thread':
      return <ThreadPage />
    case 'new':
      return <NewThreadPage />
    case 'categories':
      return <CategoriesPage />
    default:
      return <ThreadsPage />
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
