'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import IssuesPage from './issues/page'
import IssueDetailPage from './issue-detail/page'
import TriagePage from './triage/page'
import BoardPage from './board/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'issues':
      return <IssuesPage />
    case 'issue-detail':
      return <IssueDetailPage />
    case 'triage':
      return <TriagePage />
    case 'board':
      return <BoardPage />
    default:
      return <IssuesPage />
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
