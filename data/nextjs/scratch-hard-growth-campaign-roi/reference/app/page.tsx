'use client'
import { GrowthProvider } from '../components/GrowthProvider'
import { NavBar } from '../components/NavBar'
import { Campaigns } from '../components/Campaigns'
import { Channels } from '../components/Channels'
import { Overview } from '../components/Overview'
import { Settings } from '../components/Settings'
import { useGrowth } from '../hooks/useGrowth'

function Shell() {
  const { route, theme } = useGrowth()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'campaigns' && <Campaigns />}
      {route === 'channels' && <Channels />}
      {route === 'overview' && <Overview />}
      {route === 'settings' && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <GrowthProvider>
      <Shell />
    </GrowthProvider>
  )
}
