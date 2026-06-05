'use client'
import { FinanceProvider } from '../components/FinanceProvider'
import { NavBar } from '../components/NavBar'
import { Transactions } from '../components/Transactions'
import { Budgets } from '../components/Budgets'
import { Reports } from '../components/Reports'
import { Settings } from '../components/Settings'
import { useFinance } from '../hooks/useFinance'

function Shell() {
  const { route, theme } = useFinance()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'transactions' && <Transactions />}
      {route === 'budgets' && <Budgets />}
      {route === 'reports' && <Reports />}
      {route === 'settings' && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <FinanceProvider>
      <Shell />
    </FinanceProvider>
  )
}
