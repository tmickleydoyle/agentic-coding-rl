'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, showLowStockOnly, toggleShowLowStockOnly } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show low stock only"
          checked={showLowStockOnly}
          onChange={toggleShowLowStockOnly}
        />
        Show low stock only
      </label>
    </section>
  )
}
