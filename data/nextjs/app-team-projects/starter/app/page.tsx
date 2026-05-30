'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ProjectsPage from './projects/page'
import ProjectDetailPage from './project-detail/page'
import MembersPage from './members/page'
import BoardPage from './board/page'

function ActivePage() {
  const { route } = useApp()
  // TODO: render the page matching `route`.
  switch (route) {
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
