'use client'
import { PlatformProvider } from '../components/PlatformProvider'
import { NavBar } from '../components/NavBar'
import { Releases } from '../components/Releases'
import { Tickets } from '../components/Tickets'
import { Readiness } from '../components/Readiness'
import { usePlatform } from '../hooks/usePlatform'

function Shell() {
  const { route } = usePlatform()
  return (
    <div>
      <NavBar />
      {route === 'releases' && <Releases />}
      {route === 'tickets' && <Tickets />}
      {route === 'readiness' && <Readiness />}
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
