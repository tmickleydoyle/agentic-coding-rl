'use client'
import { RoutineProvider, useRoutine } from '../components/RoutineProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import RoutinesPage from './routines/page'
import BuilderPage from './builder/page'
import StatsPage from './stats/page'

function ActivePage() {
  const { route } = useRoutine()
  switch (route) {
    case 'today':
      return <TodayPage />
    case 'routines':
      return <RoutinesPage />
    case 'builder':
      return <BuilderPage />
    case 'stats':
      return <StatsPage />
    default:
      return <TodayPage />
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
