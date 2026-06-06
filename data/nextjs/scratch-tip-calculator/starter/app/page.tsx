'use client'
import { useState } from 'react'

export default function App() {
  const [bill, setBill] = useState('')
  const [tipPct, setTipPct] = useState('15')
  const [people, setPeople] = useState('1')

  return (
    <div>
      <h1>Tip Calculator</h1>
      <div data-testid="tip-amount">$0.00</div>
      <div data-testid="total-amount">$0.00</div>
      <div data-testid="per-person">$0.00</div>
    </div>
  )
}
