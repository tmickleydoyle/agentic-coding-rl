'use client'
import { WorkoutProvider, useWorkout } from '../components/WorkoutProvider'
import NavBar from '../components/NavBar'
import LogPage from './log/page'
import WorkoutDetailPage from './workout-detail/page'
import ExercisesPage from './exercises/page'
import RecordsPage from './records/page'

function ActivePage() {
  const { route } = useWorkout()
  switch (route) {
    case 'log':
      return <LogPage />
    case 'workout-detail':
      return <WorkoutDetailPage />
    case 'exercises':
      return <ExercisesPage />
    case 'records':
      return <RecordsPage />
    default:
      return <LogPage />
  }
}

function Shell() {
  const { theme } = useWorkout()
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
    <WorkoutProvider>
      <Shell />
    </WorkoutProvider>
  )
}
