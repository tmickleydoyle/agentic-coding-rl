'use client'
import { StepProvider, useStep } from '../components/StepProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import HistoryPage from './history/page'
import GoalsPage from './goals/page'
import StatsPage from './stats/page'

function ActivePage() {
  const { route } = useStep()
  switch (route) {
    case 'today':
      return <TodayPage />
    case 'history':
      return <HistoryPage />
    case 'goals':
      return <GoalsPage />
    case 'stats':
      return <StatsPage />
    default:
      return <TodayPage />
  }
}

function Shell() {
  const { theme } = useStep()
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
    <StepProvider>
      <Shell />
    </StepProvider>
  )
}
