'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import PostsPage from './posts/page'
import EditorPage from './editor/page'
import CategoriesPage from './categories/page'
import PublishedPage from './published/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'posts':
      return <PostsPage />
    case 'editor':
      return <EditorPage />
    case 'categories':
      return <CategoriesPage />
    case 'published':
      return <PublishedPage />
    default:
      return <PostsPage />
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
