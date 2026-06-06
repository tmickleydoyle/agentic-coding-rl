'use client'
import { useState } from 'react'

const OPERATORS = new Set(['+', '-', '*', '/'])

interface HistoryEntry {
  id: number
  token: string
  stackSnapshot: string
}

export default function App() {
  const [token, setToken] = useState('')
  const [stack, setStack] = useState<number[]>([])
  const [lastResult, setLastResult] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [nextId, setNextId] = useState(1)

  function addHistory(tok: string, newStack: number[]) {
    const snapshot = '[' + newStack.join(', ') + ']'
    setHistory(h => [...h, { id: nextId, token: tok, stackSnapshot: snapshot }])
    setNextId(n => n + 1)
  }

  function handlePush() {
    const t = token.trim()
    if (!t) return

    if (OPERATORS.has(t)) {
      if (stack.length < 2) {
        setErrorMessage('Insufficient operands')
        setLastResult('Error')
        return
      }
      const b = stack[stack.length - 1]
      const a = stack[stack.length - 2]
      let result: number
      if (t === '+') result = a + b
      else if (t === '-') result = a - b
      else if (t === '*') result = a * b
      else {
        if (b === 0) {
          setErrorMessage('Division by zero')
          setLastResult('Error')
          return
        }
        result = a / b
      }
      const newStack = [...stack.slice(0, -2), result]
      setStack(newStack)
      setLastResult(String(result))
      setErrorMessage(null)
      addHistory(t, newStack)
      setToken('')
      return
    }

    const num = Number(t)
    if (!Number.isFinite(num) || t === '') {
      setErrorMessage('Invalid token')
      setLastResult('Error')
      return
    }

    const newStack = [...stack, num]
    setStack(newStack)
    setLastResult(String(num))
    setErrorMessage(null)
    addHistory(t, newStack)
    setToken('')
  }

  function handleClearStack() {
    setStack([])
    setLastResult(null)
    setErrorMessage(null)
  }

  function handleClearHistory() {
    setHistory([])
  }

  const stackTop = stack.length > 0 ? stack[stack.length - 1] : null

  return (
    <div>
      <h1>RPN Calculator</h1>

      <div>
        <label htmlFor="token-input">Token</label>
        <input
          id="token-input"
          type="text"
          value={token}
          onChange={e => setToken(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handlePush() }}
        />
        <button onClick={handlePush}>Push</button>
      </div>

      <div>
        <p>Last result: <span data-testid="last-result">{lastResult ?? '—'}</span></p>
        <p data-testid="error-message">{errorMessage ?? ''}</p>
      </div>

      <div>
        <p>Stack depth: <span data-testid="stack-depth">{stack.length}</span></p>
        {stackTop !== null && (
          <p>Top: <span data-testid="stack-top">{stackTop}</span></p>
        )}
        <ul>
          {stack.map((val, idx) => (
            <li key={idx} data-testid="stack-item">{val}</li>
          ))}
        </ul>
      </div>

      <button onClick={handleClearStack}>Clear Stack</button>
      <button onClick={handleClearHistory}>Clear History</button>

      <ul>
        {history.map(entry => (
          <li key={entry.id} data-testid="history-entry">
            {entry.token} → {entry.stackSnapshot}
          </li>
        ))}
      </ul>
    </div>
  )
}
