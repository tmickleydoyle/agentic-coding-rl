'use client'
import { AppProvider } from '../components/AppProvider'
import { NavBar } from '../components/NavBar'
import { DeliverablesView } from '../components/DeliverablesView'
import { SummaryView } from '../components/SummaryView'
import { SettingsView } from '../components/SettingsView'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route, theme } = useApp()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'deliverables' && <DeliverablesView />}
      {route === 'summary' && <SummaryView />}
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
