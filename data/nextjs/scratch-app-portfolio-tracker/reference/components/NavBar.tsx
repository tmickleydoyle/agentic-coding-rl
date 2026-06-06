'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
export function NavBar() {
  const { setRoute } = useApp()
  return <nav>
    <button data-testid="nav-home" onClick={() => setRoute('home')}>Home</button>
    <button data-testid="nav-holdings" onClick={() => setRoute('holdings')}>Holdings</button>
    <button data-testid="nav-transactions" onClick={() => setRoute('transactions')}>Transactions</button>
    <button data-testid="nav-performance" onClick={() => setRoute('performance')}>Performance</button>
  </nav>
}
