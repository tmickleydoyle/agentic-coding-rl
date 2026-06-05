'use client'
import { SalonProvider } from '../components/SalonProvider'
import { NavBar } from '../components/NavBar'
import { Appointments } from '../components/Appointments'
import { Stylists } from '../components/Stylists'
import { Reports } from '../components/Reports'
import { Settings } from '../components/Settings'
import { useSalon } from '../hooks/useSalon'

function Shell() {
  const { route, theme } = useSalon()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'appointments' && <Appointments />}
      {route === 'stylists' && <Stylists />}
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
