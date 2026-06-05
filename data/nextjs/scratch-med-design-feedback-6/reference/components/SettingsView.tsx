'use client'
import { useApp } from '../hooks/useApp'

export function SettingsView() {
  const { theme, toggleTheme, showOpenOnly, toggleShowOpenOnly } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Default to open only"
          checked={showOpenOnly}
          onChange={toggleShowOpenOnly}
        />
        Default to open only
      </label>
    </section>
  )
}
