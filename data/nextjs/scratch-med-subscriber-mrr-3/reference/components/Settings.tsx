'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, filterInactive, toggleFilterInactive } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Filter inactive"
          checked={filterInactive}
          onChange={toggleFilterInactive}
        />
        Filter inactive
      </label>
    </section>
  )
}
