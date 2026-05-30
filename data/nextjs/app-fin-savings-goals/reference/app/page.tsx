'use client'
import { GoalsProvider, useGoals } from '../components/GoalsProvider'
import NavBar from '../components/NavBar'
import GoalsPage from './goals/page'
import GoalDetailPage from './goal-detail/page'
import AddGoalPage from './add-goal/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useGoals()
  switch (route) {
    case 'goals':
      return <GoalsPage />
    case 'goal-detail':
      return <GoalDetailPage />
    case 'add-goal':
      return <AddGoalPage />
    case 'settings':
      return <SettingsPage />
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
    <GoalsProvider>
      <Shell />
    </GoalsProvider>
  )
}
