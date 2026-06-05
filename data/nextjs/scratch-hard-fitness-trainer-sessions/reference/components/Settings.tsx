'use client'
import { useStudio } from '../hooks/useStudio'

export function Settings() {
  const { theme, toggleTheme, hideAvailable, toggleHideAvailable } = useStudio()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show fully booked only"
          checked={hideAvailable}
          onChange={toggleHideAvailable}
        />
        Show fully booked only
      </label>
    </section>
  )
}
