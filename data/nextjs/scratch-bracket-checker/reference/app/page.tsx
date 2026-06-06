'use client'
import { useState } from 'react'

const OPEN = new Set(['(', '[', '{'])
const CLOSE_TO_OPEN: Record<string, string> = { ')': '(', ']': '[', '}': '{' }

function checkBrackets(expr: string): string {
  const stack: { char: string; pos: number }[] = []
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i]
    if (OPEN.has(ch)) {
      stack.push({ char: ch, pos: i + 1 })
    } else if (CLOSE_TO_OPEN[ch] !== undefined) {
      if (stack.length === 0) {
        return `Invalid: unexpected closing bracket at position ${i + 1}`
      }
      const top = stack[stack.length - 1]
      if (top.char !== CLOSE_TO_OPEN[ch]) {
        return `Invalid: mismatched bracket at position ${i + 1}`
      }
      stack.pop()
    }
  }
  if (stack.length > 0) {
    return `Invalid: unclosed opening bracket at position ${stack[0].pos}`
  }
  return 'Valid'
}

function countBrackets(expr: string): number {
  let count = 0
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i]
    if (OPEN.has(ch) || CLOSE_TO_OPEN[ch] !== undefined) count++
  }
  return count
}

interface HistoryEntry {
  id: number
  expr: string
  result: string
}

export default function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [nextId, setNextId] = useState(1)

  function handleCheck() {
    const res = checkBrackets(expression)
    setResult(res)
    setHistory(h => [...h, { id: nextId, expr: expression, result: res }])
    setNextId(n => n + 1)
  }

  function handleClear() {
    setHistory([])
  }

  const charCount = expression.length
  const bracketCount = countBrackets(expression)

  return (
    <div>
      <h1>Bracket Checker</h1>

      <div>
        <label htmlFor="expression">Expression</label>
        <textarea
          id="expression"
          placeholder="Enter expression..."
          value={expression}
          onChange={e => setExpression(e.target.value)}
        />
      </div>

      <button onClick={handleCheck}>Check</button>

      <div>
        <p>Result: <span data-testid="check-result">{result ?? '—'}</span></p>
        <p>Characters: <span data-testid="char-count">{charCount}</span></p>
        <p>Brackets: <span data-testid="bracket-count">{bracketCount}</span></p>
      </div>

      <button onClick={handleClear}>Clear History</button>

      <ul>
        {history.map(entry => (
          <li key={entry.id} data-testid="history-entry">
            {entry.expr.length > 30 ? entry.expr.slice(0, 30) + '...' : entry.expr} — {entry.result}
          </li>
        ))}
      </ul>
    </div>
  )
}
