'use client'
import { RoutineProvider, useRoutine } from '../components/RoutineProvider'
import NavBar from '../components/NavBar'
import RoutinesPage from './routines/page'
import BuilderPage from './builder/page'
import WeekPlanPage from './week-plan/page'
import LibraryPage from './library/page'

function ActivePage() {
  const { route } = useRoutine()
  switch (route) {
    case 'routines':
      return <RoutinesPage />
    case 'builder':
      return <BuilderPage />
    case 'week-plan':
      return <WeekPlanPage />
    case 'library':
      return <LibraryPage />
    default:
      return <RoutinesPage />
  }
}

function Shell() {
  const { theme } = useRoutine()
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
    <RoutineProvider>
      <Shell />
    </RoutineProvider>
  )
}
