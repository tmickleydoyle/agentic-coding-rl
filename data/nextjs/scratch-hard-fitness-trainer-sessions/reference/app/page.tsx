'use client'
import { StudioProvider } from '../components/StudioProvider'
import { NavBar } from '../components/NavBar'
import { Trainers } from '../components/Trainers'
import { Sessions } from '../components/Sessions'
import { Utilization } from '../components/Utilization'
import { Settings } from '../components/Settings'
import { useStudio } from '../hooks/useStudio'

function Shell() {
  const { route, theme } = useStudio()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'trainers' && <Trainers />}
      {route === 'sessions' && <Sessions />}
      {route === 'utilization' && <Utilization />}
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
