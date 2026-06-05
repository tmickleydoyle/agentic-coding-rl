'use client'
import { useSalon } from '../hooks/useSalon'

export function Settings() {
  const { theme, toggleTheme, hideCancelled, toggleHideCancelled } = useSalon()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide cancelled"
          checked={hideCancelled}
          onChange={toggleHideCancelled}
        />
        Hide cancelled
      </label>
    </section>
  )
}
