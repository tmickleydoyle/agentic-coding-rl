'use client'
import { PlatformProvider } from '../components/PlatformProvider'
import { NavBar } from '../components/NavBar'
import { Incidents } from '../components/Incidents'
import { Board } from '../components/Board'
import { Sla } from '../components/Sla'
import { usePlatform } from '../hooks/usePlatform'

function Shell() {
  const { route } = usePlatform()
  return (
    <div>
      <NavBar />
      {route === 'incidents' && <Incidents />}
      {route === 'board' && <Board />}
      {route === 'sla' && <Sla />}
    </div>
  )
}

export default function App() {
  return (
    <PlatformProvider>
      <Shell />
    </PlatformProvider>
  )
}
