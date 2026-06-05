'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, showTrend, toggleShowTrend } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show trend column"
          checked={showTrend}
          onChange={toggleShowTrend}
        />
        Show trend column
      </label>
    </section>
  )
}
