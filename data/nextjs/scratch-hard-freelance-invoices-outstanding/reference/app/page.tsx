'use client'
import { StudioProvider } from '../components/StudioProvider'
import { NavBar } from '../components/NavBar'
import { Invoices } from '../components/Invoices'
import { Clients } from '../components/Clients'
import { Reports } from '../components/Reports'
import { useStudio } from '../hooks/useStudio'

function Shell() {
  const { route } = useStudio()
  return (
    <div>
      <NavBar />
      {route === 'invoices' && <Invoices />}
      {route === 'clients' && <Clients />}
      {route === 'reports' && <Reports />}
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
