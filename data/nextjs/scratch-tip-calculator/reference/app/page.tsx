'use client'
import { useState } from 'react'

export default function App() {
  const [bill, setBill] = useState('')
  const [tipPct, setTipPct] = useState('15')
  const [people, setPeople] = useState('1')

  const billNum = parseFloat(bill)
  const tipNum = parseFloat(tipPct)
  const peopleNum = Math.max(1, parseInt(people, 10) || 1)

  const validBill = isFinite(billNum) && billNum > 0
  const tipAmount = validBill ? billNum * (tipNum / 100) : 0
  const total = validBill ? billNum + tipAmount : 0
  const perPerson = total / peopleNum

  function reset() {
    setBill('')
    setTipPct('15')
    setPeople('1')
  }

  function setPreset(pct: number) {
    setTipPct(String(pct))
  }

  return (
    <div>
      <h1>Tip Calculator</h1>

      <div>
        <label htmlFor="bill">Bill Amount</label>
        <input
          id="bill"
          aria-label="Bill Amount"
          type="number"
          value={bill}
          onChange={e => setBill(e.target.value)}
          min="0"
        />
      </div>

      <div>
        <label htmlFor="tip">Tip Percentage</label>
        <input
          id="tip"
          aria-label="Tip Percentage"
          type="number"
          value={tipPct}
          onChange={e => setTipPct(e.target.value)}
          min="0"
        />
      </div>

      <div>
        <button onClick={() => setPreset(15)}>15%</button>
        <button onClick={() => setPreset(20)}>20%</button>
        <button onClick={() => setPreset(25)}>25%</button>
      </div>

      <div>
        <label htmlFor="people">Number of People</label>
        <input
          id="people"
          aria-label="Number of People"
          type="number"
          value={people}
          onChange={e => setPeople(e.target.value)}
          min="1"
        />
      </div>

      <div>
        <span>Tip Amount:</span>
        <span data-testid="tip-amount">${tipAmount.toFixed(2)}</span>
      </div>

      <div>
        <span>Total Amount:</span>
        <span data-testid="total-amount">${total.toFixed(2)}</span>
      </div>

      <div>
        <span>Per Person:</span>
        <span data-testid="per-person">${perPerson.toFixed(2)}</span>
      </div>

      <button onClick={reset}>Reset</button>
    </div>
  )
}
