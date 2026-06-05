'use client'
import { SalonProvider } from '../components/SalonProvider'
import { NavBar } from '../components/NavBar'
import { Sales } from '../components/Sales'
import { Services } from '../components/Services'
import { Reports } from '../components/Reports'
import { Settings } from '../components/Settings'
import { useSalon } from '../hooks/useSalon'

function Shell() {
  const { route, theme } = useSalon()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'sales' && <Sales />}
      {route === 'services' && <Services />}
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
