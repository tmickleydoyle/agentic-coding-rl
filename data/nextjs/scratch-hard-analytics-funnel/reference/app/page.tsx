'use client'
import { FunnelProvider } from '../components/FunnelProvider'
import { NavBar } from '../components/NavBar'
import { Funnels } from '../components/Funnels'
import { Steps } from '../components/Steps'
import { Analysis } from '../components/Analysis'
import { Settings } from '../components/Settings'
import { useFunnel } from '../hooks/useFunnel'

function Shell() {
  const { route, theme } = useFunnel()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'funnels' && <Funnels />}
      {route === 'steps' && <Steps />}
      {route === 'analysis' && <Analysis />}
      {route === 'settings' && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <FunnelProvider>
      <Shell />
    </FunnelProvider>
  )
}
