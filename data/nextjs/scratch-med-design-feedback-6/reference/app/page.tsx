'use client'
import { AppProvider } from '../components/AppProvider'
import { NavBar } from '../components/NavBar'
import { FeedbackView } from '../components/FeedbackView'
import { StatsView } from '../components/StatsView'
import { SettingsView } from '../components/SettingsView'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route, theme } = useApp()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'feedback' && <FeedbackView />}
      {route === 'stats' && <StatsView />}
      {route === 'settings' && <SettingsView />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
