'use client'
import { AppProvider } from '../components/AppProvider'
import { NavBar } from '../components/NavBar'
import { ObjectivesView } from '../components/ObjectivesView'
import { StatsView } from '../components/StatsView'
import { SettingsView } from '../components/SettingsView'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route, theme } = useApp()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'objectives' && <ObjectivesView />}
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
