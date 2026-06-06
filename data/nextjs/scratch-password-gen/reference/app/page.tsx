'use client'
import { useState, useEffect } from 'react'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function buildCharset(upper: boolean, lower: boolean, numbers: boolean, symbols: boolean): string {
  let s = ''
  if (upper) s += UPPER
  if (lower) s += LOWER
  if (numbers) s += NUMBERS
  if (symbols) s += SYMBOLS
  return s
}

function generatePassword(length: number, charset: string): string {
  if (!charset) return ''
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(Math.random() * charset.length)]
  }
  return result
}

function calcStrength(upper: boolean, lower: boolean, numbers: boolean, symbols: boolean, length: number): string {
  const types = [upper, lower, numbers, symbols].filter(Boolean).length
  let score = types
  if (length >= 12) score += 1
  if (length >= 20) score += 1
  if (score <= 2) return 'Weak'
  if (score === 3) return 'Fair'
  if (score === 4) return 'Strong'
  return 'Very Strong'
}

export default function App() {
  const [length, setLength] = useState(16)
  const [upper, setUpper] = useState(true)
  const [lower, setLower] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const charset = buildCharset(true, true, true, false)
    setPassword(generatePassword(16, charset))
  }, [])

  function handleGenerate() {
    const charset = buildCharset(upper, lower, numbers, symbols)
    if (!charset) return
    setPassword(generatePassword(length, charset))
    setCopied(false)
  }

  async function handleCopy() {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
  }

  const strength = calcStrength(upper, lower, numbers, symbols, length)

  return (
    <div>
      <h1>Password Generator</h1>

      <p data-testid="password-display">{password}</p>

      <button onClick={handleCopy}>Copy</button>
      {copied && <span data-testid="copy-indicator">Copied!</span>}

      <button onClick={handleGenerate}>Generate</button>

      <div>
        <label>
          Length
          <input
            aria-label="Length"
            type="range"
            min={8}
            max={64}
            step={1}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
          />
          <span data-testid="length-display">{length}</span>
        </label>

        <label>
          <input
            aria-label="Uppercase (A-Z)"
            type="checkbox"
            checked={upper}
            onChange={e => setUpper(e.target.checked)}
          />
          Uppercase (A-Z)
        </label>

        <label>
          <input
            aria-label="Lowercase (a-z)"
            type="checkbox"
            checked={lower}
            onChange={e => setLower(e.target.checked)}
          />
          Lowercase (a-z)
        </label>

        <label>
          <input
            aria-label="Numbers (0-9)"
            type="checkbox"
            checked={numbers}
            onChange={e => setNumbers(e.target.checked)}
          />
          Numbers (0-9)
        </label>

        <label>
          <input
            aria-label="Symbols (!@#...)"
            type="checkbox"
            checked={symbols}
            onChange={e => setSymbols(e.target.checked)}
          />
          Symbols (!@#...)
        </label>
      </div>

      <p data-testid="strength">{strength}</p>
    </div>
  )
}
