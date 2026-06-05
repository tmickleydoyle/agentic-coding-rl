'use client'
import { useSalon } from '../hooks/useSalon'

export function Settings() {
  const { theme, toggleTheme, conflictsOnly, toggleConflictsOnly } = useSalon()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show conflicts only"
          checked={conflictsOnly}
          onChange={toggleConflictsOnly}
        />
        Show conflicts only
      </label>
    </section>
  )
}
