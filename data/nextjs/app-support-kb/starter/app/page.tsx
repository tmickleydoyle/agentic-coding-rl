'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ArticlesPage from './articles/page'
import ArticleDetailPage from './article-detail/page'
import CategoriesPage from './categories/page'
import SearchPage from './search/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'articles':
      return <ArticlesPage />
    case 'article-detail':
      return <ArticleDetailPage />
    case 'categories':
      return <CategoriesPage />
    case 'search':
      return <SearchPage />
    default:
      return <ArticlesPage />
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
