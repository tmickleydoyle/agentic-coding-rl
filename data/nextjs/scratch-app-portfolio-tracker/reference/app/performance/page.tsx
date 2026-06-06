'use client'
import React, { useEffect, useState } from 'react'
import { Holding } from '../../lib/types'
export function PerformancePage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  useEffect(()=>{fetch('/api/holdings').then(r=>r.json()).then((hs: Holding[])=>{
    const sorted = [...hs].sort((a,b)=>((b.currentPrice-b.purchasePrice)*b.quantity)-((a.currentPrice-a.purchasePrice)*a.quantity))
    setHoldings(sorted)
  })},[])
  return <div style={{padding:'2rem'}}><h1>Performance</h1>
    <ul data-testid="performance-list" style={{listStyle:'none',padding:0}}>
      {holdings.map(h=>{
        const gl = (h.currentPrice-h.purchasePrice)*h.quantity
        return <li key={h.id} data-testid="performance-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
          <strong>{h.symbol}</strong> {h.name}: {gl>=0?'+':''}{gl.toFixed(2)}
        </li>
      })}
    </ul>
  </div>
}
