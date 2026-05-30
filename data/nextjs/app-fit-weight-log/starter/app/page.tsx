'use client'
import { WeightProvider, useWeight } from '../components/WeightProvider'
import NavBar from '../components/NavBar'
import LogPage from './log/page'
import HistoryPage from './history/page'
import GoalPage from './goal/page'
import InsightsPage from './insights/page'

function ActivePage() {
  const { route } = useWeight()
  switch (route) {
    case 'log':
      return <LogPage />
    case 'history':
      return <HistoryPage />
    case 'goal':
      return <GoalPage />
    case 'insights':
      return <InsightsPage />
    default:
      return <LogPage />
  }
}

function Shell() {
  const { theme } = useWeight()
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
    <WeightProvider>
      <Shell />
    </WeightProvider>
  )
}
