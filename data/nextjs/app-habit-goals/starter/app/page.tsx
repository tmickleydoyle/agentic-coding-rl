'use client'
import { GoalProvider, useGoals } from '../components/GoalProvider'
import NavBar from '../components/NavBar'
import GoalsPage from './goals/page'
import GoalDetailPage from './goal-detail/page'
import AddPage from './add/page'
import CompletedPage from './completed/page'

function ActivePage() {
  const { route } = useGoals()
  switch (route) {
    case 'goals':
      return <GoalsPage />
    case 'goal-detail':
      return <GoalDetailPage />
    case 'add':
      return <AddPage />
    case 'completed':
      return <CompletedPage />
    default:
      return <GoalsPage />
  }
}

function Shell() {
  const { theme } = useGoals()
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
    <GoalProvider>
      <Shell />
    </GoalProvider>
  )
}
