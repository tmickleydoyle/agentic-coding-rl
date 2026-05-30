'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import QuizzesPage from './quizzes/page'
import TakePage from './take/page'
import ResultsPage from './results/page'
import ReviewPage from './review/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'quizzes':
      return <QuizzesPage />
    case 'take':
      return <TakePage />
    case 'results':
      return <ResultsPage />
    case 'review':
      return <ReviewPage />
    default:
      return <QuizzesPage />
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
