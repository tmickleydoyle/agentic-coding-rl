'use client'
import { useState } from 'react'

type Base = 2 | 8 | 10 | 16

const BASE_OPTIONS: { label: string; value: Base }[] = [
  { label: 'Binary (2)', value: 2 },
  { label: 'Octal (8)', value: 8 },
  { label: 'Decimal (10)', value: 10 },
  { label: 'Hexadecimal (16)', value: 16 },
]

const PATTERNS: Record<number, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^(0|[1-9][0-9]*)$/,
  16: /^[0-9a-fA-F]+$/,
}

type Result = { binary: string; octal: string; decimal: string; hex: string } | null

function convert(input: string, fromBase: Base): Result | 'error' {
  const trimmed = input.trim()
  if (!trimmed) return 'error'
  const pattern = PATTERNS[fromBase]
  if (!pattern.test(trimmed)) return 'error'
  const value = parseInt(trimmed, fromBase)
  if (isNaN(value)) return 'error'
  return {
    binary: value.toString(2),
    octal: value.toString(8),
    decimal: value.toString(10),
    hex: value.toString(16).toUpperCase(),
  }
}

export default function App() {
  const [input, setInput] = useState('42')
  const [fromBase, setFromBase] = useState<Base>(10)
  const [result, setResult] = useState<Result | 'error'>(() => convert('42', 10))

  function handleConvert() {
    setResult(convert(input, fromBase))
  }

  const hasError = result === 'error'
  const res = result !== 'error' ? result : null

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>Base Converter</h1>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        <label htmlFor="input-value">Input Value</label>
        <input
          id="input-value"
          aria-label="Input Value"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ padding: '0.25rem' }}
        />
        <label htmlFor="from-base">From Base</label>
        <select
          id="from-base"
          aria-label="From Base"
          value={fromBase}
          onChange={e => setFromBase(parseInt(e.target.value) as Base)}
        >
          {BASE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button onClick={handleConvert}>Convert</button>
      </div>

      {hasError && (
        <p data-testid="error-message" style={{ color: 'red' }}>
          Invalid input for the selected base.
        </p>
      )}

      {res && (
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '0.25rem 0.5rem', fontWeight: 'bold' }}>Binary (2)</td>
              <td style={{ padding: '0.25rem 0.5rem' }}>
                <span data-testid="result-binary">{res.binary}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.25rem 0.5rem', fontWeight: 'bold' }}>Octal (8)</td>
              <td style={{ padding: '0.25rem 0.5rem' }}>
                <span data-testid="result-octal">{res.octal}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.25rem 0.5rem', fontWeight: 'bold' }}>Decimal (10)</td>
              <td style={{ padding: '0.25rem 0.5rem' }}>
                <span data-testid="result-decimal">{res.decimal}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.25rem 0.5rem', fontWeight: 'bold' }}>Hexadecimal (16)</td>
              <td style={{ padding: '0.25rem 0.5rem' }}>
                <span data-testid="result-hex">{res.hex}</span>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}
