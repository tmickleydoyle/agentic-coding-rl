'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import IssuesPage from './issues/page'
import IssueDetailPage from './issue-detail/page'
import TriagePage from './triage/page'
import BoardPage from './board/page'

function ActivePage() {
  const { route } = useApp()
  // TODO: render the page matching `route`.
  switch (route) {
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
