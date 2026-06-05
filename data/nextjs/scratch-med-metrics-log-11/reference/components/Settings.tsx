'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, filterLow, toggleFilterLow } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Filter low values"
          checked={filterLow}
          onChange={toggleFilterLow}
        />
        Filter low values
      </label>
    </section>
  )
}
