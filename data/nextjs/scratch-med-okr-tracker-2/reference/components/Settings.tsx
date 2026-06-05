'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, filterOnTrack, toggleFilterOnTrack } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Filter: on track only"
          checked={filterOnTrack}
          onChange={toggleFilterOnTrack}
        />
        Filter: on track only
      </label>
    </section>
  )
}
