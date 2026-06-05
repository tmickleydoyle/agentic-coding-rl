'use client'
import { ExperimentsProvider } from '../components/ExperimentsProvider'
import { NavBar } from '../components/NavBar'
import { Experiments } from '../components/Experiments'
import { Variants } from '../components/Variants'
import { Results } from '../components/Results'
import { Settings } from '../components/Settings'
import { useExperiments } from '../hooks/useExperiments'

function Shell() {
  const { route, theme } = useExperiments()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'experiments' && <Experiments />}
      {route === 'variants' && <Variants />}
      {route === 'results' && <Results />}
      {route === 'settings' && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <ExperimentsProvider>
      <Shell />
    </ExperimentsProvider>
  )
}
