'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, showOnlyRemaining, toggleShowOnlyRemaining } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show only remaining"
          checked={showOnlyRemaining}
          onChange={toggleShowOnlyRemaining}
        />
        Show only remaining
      </label>
    </section>
  )
}
