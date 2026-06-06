'use client'
import React, { useEffect, useState } from 'react'
import { Holding } from '../../lib/types'
export function HomePage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [txCount, setTxCount] = useState(0)
  useEffect(() => {
    fetch('/api/holdings').then(r=>r.json()).then(setHoldings)
    fetch('/api/transactions').then(r=>r.json()).then((d: unknown[])=>setTxCount(d.length))
  }, [])
  const totalValue = holdings.reduce((s,h)=>s+h.quantity*h.currentPrice,0)
  return <div style={{padding:'2rem'}}>
    <h1>Portfolio Dashboard</h1>
    <p>Holdings: <span data-testid="dashboard-holdings-count">{holdings.length}</span></p>
    <p>Portfolio Value: <span data-testid="dashboard-portfolio-value">${totalValue.toFixed(2)}</span></p>
    <p>Transactions: <span data-testid="dashboard-transaction-count">{txCount}</span></p>
  </div>
}
