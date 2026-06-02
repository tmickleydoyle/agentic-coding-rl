'use client'
import { AppProvider } from '../components/AppProvider'
import { NavBar } from '../components/NavBar'
import { Objectives } from '../components/Objectives'
import { Dashboard } from '../components/Dashboard'
import { Settings } from '../components/Settings'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route, theme } = useApp()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'objectives' && <Objectives />}
      {route === 'dashboard' && <Dashboard />}
      {route === 'settings' && <Settings />}
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
