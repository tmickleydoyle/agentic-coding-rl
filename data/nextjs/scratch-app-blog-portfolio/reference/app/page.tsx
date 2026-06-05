'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import HomePage from './home/page'
import ProjectsPage from './projects/page'
import WritingPage from './writing/page'
import ProjectDetailPage from './project-detail/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'home':
      return <HomePage />
    case 'projects':
      return <ProjectsPage />
    case 'writing':
      return <WritingPage />
    case 'project-detail':
      return <ProjectDetailPage />
    default:
      return <HomePage />
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
