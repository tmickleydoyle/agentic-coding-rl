'use client'
import { useState } from 'react'

const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine',
  'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
const TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']

function belowThousand(n: number): string {
  if (n < 20) return ONES[n]
  if (n < 100) {
    const t = TENS[Math.floor(n / 10)]
    const o = n % 10
    return o === 0 ? t : `${t}-${ONES[o]}`
  }
  const h = Math.floor(n / 100)
  const rest = n % 100
  const hundredPart = `${ONES[h]} hundred`
  if (rest === 0) return hundredPart
  return `${hundredPart} ${belowThousand(rest)}`
}

function toWords(n: number): string {
  if (n < 0) return `negative ${toWords(-n)}`
  if (n === 0) return 'zero'
  if (n < 1000) return belowThousand(n)
  const thousands = Math.floor(n / 1000)
  const rest = n % 1000
  const thousandPart = `${belowThousand(thousands)} thousand`
  if (rest === 0) return thousandPart
  return `${thousandPart} ${belowThousand(rest)}`
}

export default function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  function handleConvert() {
    if (input.trim() === '') {
      setError('Please enter a number')
      setResult('')
      return
    }
    if (input.includes('.')) {
      setError('Please enter a whole number')
      setResult('')
      return
    }
    const n = parseInt(input, 10)
    if (isNaN(n) || n < -999999 || n > 999999) {
      setError('Number out of range (−999,999 to 999,999)')
      setResult('')
      return
    }
    setError('')
    setResult(toWords(n))
  }

  return (
    <div>
      <h1>Number to Words</h1>
      <input
        aria-label="Enter a number"
        type="number"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={handleConvert}>Convert</button>
      <p data-testid="result">{result}</p>
      <p data-testid="error">{error}</p>
    </div>
  )
}
