'use client'
import { AppProvider } from '../components/AppProvider'
import { NavBar } from '../components/NavBar'
import { Inbox } from '../components/Inbox'
import { Stats } from '../components/Stats'
import { Settings } from '../components/Settings'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route, uiTheme } = useApp()
  return (
    <div data-theme={uiTheme}>
      <NavBar />
      {route === 'inbox' && <Inbox />}
      {route === 'stats' && <Stats />}
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
