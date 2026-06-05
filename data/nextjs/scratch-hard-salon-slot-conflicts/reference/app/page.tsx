'use client'
import { SalonProvider } from '../components/SalonProvider'
import { NavBar } from '../components/NavBar'
import { Schedule } from '../components/Schedule'
import { Conflicts } from '../components/Conflicts'
import { Reports } from '../components/Reports'
import { Settings } from '../components/Settings'
import { useSalon } from '../hooks/useSalon'

function Shell() {
  const { route, theme } = useSalon()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'schedule' && <Schedule />}
      {route === 'conflicts' && <Conflicts />}
      {route === 'reports' && <Reports />}
      {route === 'settings' && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <SalonProvider>
      <Shell />
    </SalonProvider>
  )
}
