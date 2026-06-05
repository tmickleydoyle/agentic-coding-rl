'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, decimals, setDecimals } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <div>
        <label htmlFor="decimal-places-select">Decimal places</label>
        <select
          id="decimal-places-select"
          aria-label="Decimal places"
          value={decimals}
          onChange={(e) => setDecimals(Number(e.target.value))}
        >
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </div>
    </section>
  )
}
