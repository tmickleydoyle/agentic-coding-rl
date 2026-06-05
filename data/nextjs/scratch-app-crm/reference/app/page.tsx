'use client'
import { CrmProvider } from '../components/CrmProvider'
import { NavBar } from '../components/NavBar'
import { Contacts } from '../components/Contacts'
import { Pipeline } from '../components/Pipeline'
import { Reports } from '../components/Reports'
import { Settings } from '../components/Settings'
import { useCrm } from '../hooks/useCrm'

function Shell() {
  const { route, theme } = useCrm()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'contacts' && <Contacts />}
      {route === 'pipeline' && <Pipeline />}
      {route === 'reports' && <Reports />}
      {route === 'settings' && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <CrmProvider>
      <Shell />
    </CrmProvider>
  )
}
