'use client'
import { StudioProvider } from '../components/StudioProvider'
import { NavBar } from '../components/NavBar'
import { Classes } from '../components/Classes'
import { Bookings } from '../components/Bookings'
import { Roster } from '../components/Roster'
import { Settings } from '../components/Settings'
import { useStudio } from '../hooks/useStudio'

function Shell() {
  const { route, theme } = useStudio()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'classes' && <Classes />}
      {route === 'bookings' && <Bookings />}
      {route === 'roster' && <Roster />}
      {route === 'settings' && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <StudioProvider>
      <Shell />
    </StudioProvider>
  )
}
