'use client'
import { useGrowth } from '../hooks/useGrowth'

export function Settings() {
  const { theme, toggleTheme, activeOnly, toggleActiveOnly } = useGrowth()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show active only"
          checked={activeOnly}
          onChange={toggleActiveOnly}
        />
        Show active only
      </label>
    </section>
  )
}
