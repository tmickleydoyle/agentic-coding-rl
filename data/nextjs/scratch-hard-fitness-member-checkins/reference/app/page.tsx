'use client'
import { GymProvider } from '../components/GymProvider'
import { NavBar } from '../components/NavBar'
import { Members } from '../components/Members'
import { CheckIns } from '../components/CheckIns'
import { Progress } from '../components/Progress'
import { Settings } from '../components/Settings'
import { useGym } from '../hooks/useGym'

function Shell() {
  const { route, theme } = useGym()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'members' && <Members />}
      {route === 'checkins' && <CheckIns />}
      {route === 'progress' && <Progress />}
      {route === 'settings' && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <GymProvider>
      <Shell />
    </GymProvider>
  )
}
