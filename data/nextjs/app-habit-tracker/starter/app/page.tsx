'use client'
import { HabitProvider, useHabits } from '../components/HabitProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import HabitsPage from './habits/page'
import AddPage from './add/page'
import StatsPage from './stats/page'

function ActivePage() {
  const { route } = useHabits()
  switch (route) {
    case 'today':
      return <TodayPage />
    case 'habits':
      return <HabitsPage />
    case 'add':
      return <AddPage />
    case 'stats':
      return <StatsPage />
    default:
      return <TodayPage />
  }
}

function Shell() {
  const { theme } = useHabits()
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
    <HabitProvider>
      <Shell />
    </HabitProvider>
  )
}
