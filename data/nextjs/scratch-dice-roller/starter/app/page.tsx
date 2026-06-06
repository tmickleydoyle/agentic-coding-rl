'use client'
import { useState } from 'react'

export default function App() {
  const [dieType, setDieType] = useState(6)
  const [numDice, setNumDice] = useState(2)

  return (
    <div>
      <h1>Dice Roller</h1>
      <div>
        <label htmlFor="die-type">Die Type</label>
        <select id="die-type" value={dieType} onChange={e => setDieType(Number(e.target.value))}>
          <option value={4}>d4</option>
          <option value={6}>d6</option>
          <option value={8}>d8</option>
          <option value={10}>d10</option>
          <option value={12}>d12</option>
          <option value={20}>d20</option>
        </select>
      </div>
      <div>
        <label htmlFor="num-dice">Number of Dice</label>
        <input id="num-dice" type="number" min={1} max={10} value={numDice} onChange={e => setNumDice(Number(e.target.value))} />
      </div>
      <button onClick={() => {}}>Roll</button>
      <div>
        <p>Results: <span data-testid="last-roll-results">—</span></p>
        <p>Sum: <span data-testid="last-roll-sum">—</span></p>
        <p>Count: <span data-testid="last-roll-count">—</span></p>
      </div>
      <button onClick={() => {}}>Clear History</button>
      <ul></ul>
    </div>
  )
}
