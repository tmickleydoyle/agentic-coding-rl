'use client'
import { GrowthProvider } from '../components/GrowthProvider'
import { NavBar } from '../components/NavBar'
import { Blasts } from '../components/Blasts'
import { Lists } from '../components/Lists'
import { Overview } from '../components/Overview'
import { Settings } from '../components/Settings'
import { useGrowth } from '../hooks/useGrowth'

function Shell() {
  const { route, theme } = useGrowth()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'blasts' && <Blasts />}
      {route === 'lists' && <Lists />}
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
