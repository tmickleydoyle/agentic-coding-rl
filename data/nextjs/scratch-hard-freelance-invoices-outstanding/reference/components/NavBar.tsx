'use client'
import { useStudio } from '../hooks/useStudio'

export function NavBar() {
  const { navigate } = useStudio()
  return (
    <nav>
      <button onClick={() => navigate('invoices')}>Invoices</button>
      <button onClick={() => navigate('clients')}>Clients</button>
      <button onClick={() => navigate('reports')}>Reports</button>
    </nav>
  )
}
