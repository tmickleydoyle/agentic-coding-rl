'use client'
import { useApp } from '../hooks/useApp'
import type { StatusType } from '../lib/types'

export function Settings() {
  const { theme, toggleTheme, defaultStatus, setDefaultStatus } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <div>
        <select
          aria-label="Default status"
          value={defaultStatus}
          onChange={(e) => setDefaultStatus(e.target.value as StatusType)}
        >
          <option value="Live">Live</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
    </section>
  )
}
