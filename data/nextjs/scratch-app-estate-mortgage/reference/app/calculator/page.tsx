'use client'
import { useState } from 'react'
import { useMortgage } from '../../components/AppStateProvider'
import { monthlyPayment, totalInterest } from '../../lib/mortgage'

export default function CalculatorPage() {
  const {
    rate,
    termYears,
    downPayment,
    setRate,
    setTermYears,
    setDownPayment,
    theme,
    setTheme,
  } = useMortgage()
  const [price, setPrice] = useState<number>(400000)

  const input = { price, downPayment, rate, termYears }
  const monthly = monthlyPayment(input)
  const interest = totalInterest(input)

  return (
    <section data-testid="page-calculator">
      <h1>Calculator</h1>

      <label htmlFor="price-input">Price</label>
      <input
        id="price-input"
        data-testid="price-input"
        value={String(price)}
        onChange={(e) => setPrice(Number(e.target.value) || 0)}
      />

      <label htmlFor="down-input">Down payment</label>
      <input
        id="down-input"
        data-testid="down-input"
        value={String(downPayment)}
        onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
      />

      <label htmlFor="rate-input">Rate</label>
      <input
        id="rate-input"
        data-testid="rate-input"
        value={String(rate)}
        onChange={(e) => setRate(Number(e.target.value) || 0)}
      />

      <label htmlFor="term-input">Term (years)</label>
      <input
        id="term-input"
        data-testid="term-input"
        value={String(termYears)}
        onChange={(e) => setTermYears(Number(e.target.value) || 0)}
      />

      <p data-testid="monthly-payment">{monthly}</p>
      <p data-testid="total-interest">{interest}</p>

      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch theme
      </button>
    </section>
  )
}
