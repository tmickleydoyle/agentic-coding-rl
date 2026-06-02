'use client'
import { AppProvider } from '../components/AppProvider'
import { NavBar } from '../components/NavBar'
import { Checklist } from '../components/Checklist'
import { Summary } from '../components/Summary'
import { Settings } from '../components/Settings'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route, theme } = useApp()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'checklist' && <Checklist />}
      {route === 'summary' && <Summary />}
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
