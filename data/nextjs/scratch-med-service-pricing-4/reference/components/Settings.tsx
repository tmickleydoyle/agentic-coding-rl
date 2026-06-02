'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, hideInactive, toggleHideInactive } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide inactive"
          checked={hideInactive}
          onChange={toggleHideInactive}
        />
        Hide inactive
      </label>
    </section>
  )
}
