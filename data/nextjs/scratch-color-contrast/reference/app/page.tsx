'use client'
import { useState } from 'react'

const SEED_FG = '#1a1a2e'
const SEED_BG = '#e0e0e0'

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.startsWith('#') ? hex.slice(1) : hex
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function linearize(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(linearize)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

interface Results {
  ratio: number
  aaNormal: boolean
  aaLarge: boolean
  aaaNormal: boolean
  aaaLarge: boolean
}

export default function App() {
  const [fg, setFg] = useState(SEED_FG)
  const [bg, setBg] = useState(SEED_BG)
  const [results, setResults] = useState<Results | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [show, setShow] = useState(false)

  function check() {
    const fgRgb = hexToRgb(fg.trim())
    const bgRgb = hexToRgb(bg.trim())
    if (!fgRgb || !bgRgb) {
      setError('Invalid hex color')
      setResults(null)
      setShow(true)
      return
    }
    const lFg = luminance(fgRgb)
    const lBg = luminance(bgRgb)
    const ratio = contrastRatio(lFg, lBg)
    setResults({
      ratio,
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3.0,
      aaaNormal: ratio >= 7.0,
      aaaLarge: ratio >= 4.5,
    })
    setError(null)
    setShow(true)
  }

  function reset() {
    setFg(SEED_FG)
    setBg(SEED_BG)
    setResults(null)
    setError(null)
    setShow(false)
  }

  const fgValid = hexToRgb(fg.trim())
  const bgValid = hexToRgb(bg.trim())
  const previewStyle = {
    color: fgValid ? fg : undefined,
    backgroundColor: bgValid ? bg : undefined,
    padding: '16px',
    marginTop: '8px',
  }

  return (
    <div>
      <h1>Color Contrast Checker</h1>
      <div>
        <label>
          Foreground Color
          <input
            aria-label="Foreground Color"
            value={fg}
            onChange={e => setFg(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Background Color
          <input
            aria-label="Background Color"
            value={bg}
            onChange={e => setBg(e.target.value)}
          />
        </label>
      </div>
      <button onClick={check}>Check</button>
      <button onClick={reset}>Reset</button>

      <div data-testid="preview-box" style={previewStyle}>
        Sample Text
      </div>

      {show && (
        <div data-testid="results">
          {error && <p data-testid="contrast-error">{error}</p>}
          {results && (
            <div>
              <p data-testid="contrast-ratio">{results.ratio.toFixed(2)}:1</p>
              <table>
                <tbody>
                  <tr>
                    <td>AA Normal</td>
                    <td data-testid="aa-normal">{results.aaNormal ? 'PASS' : 'FAIL'}</td>
                  </tr>
                  <tr>
                    <td>AA Large</td>
                    <td data-testid="aa-large">{results.aaLarge ? 'PASS' : 'FAIL'}</td>
                  </tr>
                  <tr>
                    <td>AAA Normal</td>
                    <td data-testid="aaa-normal">{results.aaaNormal ? 'PASS' : 'FAIL'}</td>
                  </tr>
                  <tr>
                    <td>AAA Large</td>
                    <td data-testid="aaa-large">{results.aaaLarge ? 'PASS' : 'FAIL'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
