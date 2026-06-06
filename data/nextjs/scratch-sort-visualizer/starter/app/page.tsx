'use client'
import { useState } from 'react'

const SEED = [64, 34, 25, 12, 22, 11, 90]

export default function App() {
  const [inputText, setInputText] = useState(SEED.join(', '))
  const [arr] = useState<number[]>([...SEED])

  return (
    <div>
      <h1>Sort Visualizer</h1>
      <div>
        <label htmlFor="array-input">Array</label>
        <input
          id="array-input"
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <button onClick={() => {}}>Set Array</button>
      </div>
      <div>
        <button onClick={() => {}}>Step</button>
        <button onClick={() => {}}>Sort All</button>
        <button onClick={() => {}}>Reset</button>
      </div>
      <div>
        {arr.map((val, idx) => (
          <span key={idx} data-testid="array-cell">{val}</span>
        ))}
      </div>
      <div>
        <span>Steps: </span><span data-testid="step-count">0</span>
        <span> Status: </span><span data-testid="sort-status">In progress</span>
        <span> Swaps: </span><span data-testid="swap-count">0</span>
        <span> Comparisons: </span><span data-testid="comparison-count">0</span>
      </div>
    </div>
  )
}
