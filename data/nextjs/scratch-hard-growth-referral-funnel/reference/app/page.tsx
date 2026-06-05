'use client'
import { GrowthProvider } from '../components/GrowthProvider'
import { NavBar } from '../components/NavBar'
import { Referrals } from '../components/Referrals'
import { Sources } from '../components/Sources'
import { Funnel } from '../components/Funnel'
import { Settings } from '../components/Settings'
import { useGrowth } from '../hooks/useGrowth'

function Shell() {
  const { route, theme } = useGrowth()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'referrals' && <Referrals />}
      {route === 'sources' && <Sources />}
      {route === 'funnel' && <Funnel />}
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
