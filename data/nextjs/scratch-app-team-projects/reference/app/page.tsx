'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ProjectsPage from './projects/page'
import ProjectDetailPage from './project-detail/page'
import MembersPage from './members/page'
import BoardPage from './board/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'projects':
      return <ProjectsPage />
    case 'project-detail':
      return <ProjectDetailPage />
    case 'members':
      return <MembersPage />
    case 'board':
      return <BoardPage />
    default:
      return <ProjectsPage />
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
