'use client'
import { LedgerProvider } from '../components/LedgerProvider'
import { NavBar } from '../components/NavBar'
import { Ledger } from '../components/Ledger'
import { Categories } from '../components/Categories'
import { Report } from '../components/Report'
import { useLedger } from '../hooks/useLedger'

function Shell() {
  const { route } = useLedger()
  return (
    <div>
      <NavBar />
      {route === 'ledger' && <Ledger />}
      {route === 'categories' && <Categories />}
      {route === 'report' && <Report />}
    </div>
  )
}

export default function App() {
  return (
    <LedgerProvider>
      <Shell />
    </LedgerProvider>
  )
}
