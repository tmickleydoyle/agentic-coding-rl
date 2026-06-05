'use client'
import { MoodProvider, useMood } from '../components/MoodProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import HistoryPage from './history/page'
import AddPage from './add/page'
import InsightsPage from './insights/page'

function ActivePage() {
  const { route } = useMood()
  switch (route) {
    case 'today':
      return <TodayPage />
    case 'history':
      return <HistoryPage />
    case 'add':
      return <AddPage />
    case 'insights':
      return <InsightsPage />
    default:
      return <TodayPage />
  }
}

function Shell() {
  const { theme } = useMood()
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
    <MoodProvider>
      <Shell />
    </MoodProvider>
  )
}
