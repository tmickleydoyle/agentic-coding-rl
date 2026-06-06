'use client'
import { useState } from 'react'

const SEED = [64, 34, 25, 12, 22, 11, 90]

interface SortState {
  arr: number[]
  i: number  // outer loop index
  j: number  // inner loop index
  done: boolean
  comparisons: number
  swaps: number
  comparingIndices: [number, number] | null
}

function initSortState(arr: number[]): SortState {
  return {
    arr: [...arr],
    i: 0,
    j: 0,
    done: arr.length <= 1,
    comparisons: 0,
    swaps: 0,
    comparingIndices: null,
  }
}

function stepBubble(state: SortState): SortState {
  if (state.done) return state
  const arr = [...state.arr]
  const n = arr.length
  let { i, j, comparisons, swaps } = state

  // Current step: compare arr[j] and arr[j+1]
  const newComparisons = comparisons + 1
  let newSwaps = swaps
  if (arr[j] > arr[j + 1]) {
    const tmp = arr[j]
    arr[j] = arr[j + 1]
    arr[j + 1] = tmp
    newSwaps = swaps + 1
  }

  const comparingIndices: [number, number] = [j, j + 1]

  // Advance indices
  let newJ = j + 1
  let newI = i
  if (newJ >= n - 1 - i) {
    newJ = 0
    newI = i + 1
  }

  const done = newI >= n - 1

  return {
    arr,
    i: newI,
    j: newJ,
    done,
    comparisons: newComparisons,
    swaps: newSwaps,
    comparingIndices: done ? null : comparingIndices,
  }
}

function sortAll(state: SortState): SortState {
  let s = state
  while (!s.done) {
    s = stepBubble(s)
  }
  return s
}

export default function App() {
  const [inputText, setInputText] = useState(SEED.join(', '))
  const [baseArray, setBaseArray] = useState<number[]>([...SEED])
  const [sortState, setSortState] = useState<SortState>(() => initSortState(SEED))

  function handleSetArray() {
    const parsed = inputText.split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n))
    const arr = parsed.length > 0 ? parsed : [...SEED]
    setBaseArray(arr)
    setSortState(initSortState(arr))
  }

  function handleStep() {
    if (sortState.done) return
    setSortState(s => stepBubble(s))
  }

  function handleSortAll() {
    if (sortState.done) return
    setSortState(s => sortAll(s))
  }

  function handleReset() {
    setSortState(initSortState(baseArray))
  }

  const { arr, done, comparisons, swaps, comparingIndices } = sortState

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
        <button onClick={handleSetArray}>Set Array</button>
      </div>

      <div>
        <button onClick={handleStep} disabled={done}>Step</button>
        <button onClick={handleSortAll} disabled={done}>Sort All</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <div>
        {arr.map((val, idx) => {
          const isComparing = comparingIndices !== null && (idx === comparingIndices[0] || idx === comparingIndices[1])
          return (
            <span
              key={idx}
              data-testid={isComparing ? 'comparing-cell' : 'array-cell'}
            >
              {val}
            </span>
          )
        })}
      </div>

      <div>
        <span>Steps: </span><span data-testid="step-count">{comparisons}</span>
        <span> Status: </span><span data-testid="sort-status">{done ? 'Sorted' : 'In progress'}</span>
        <span> Swaps: </span><span data-testid="swap-count">{swaps}</span>
        <span> Comparisons: </span><span data-testid="comparison-count">{comparisons}</span>
      </div>
    </div>
  )
}
