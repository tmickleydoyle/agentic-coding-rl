'use client'
import { WaterProvider, useWater } from '../components/WaterProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import HistoryPage from './history/page'
import GoalPage from './goal/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useWater()
  switch (route) {
    case 'today':
      return <TodayPage />
    case 'history':
      return <HistoryPage />
    case 'goal':
      return <GoalPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <TodayPage />
  }
}

function Shell() {
  const { theme } = useWater()
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
    <WaterProvider>
      <Shell />
    </WaterProvider>
  )
}
