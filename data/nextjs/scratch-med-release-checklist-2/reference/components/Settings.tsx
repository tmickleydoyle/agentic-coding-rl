'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, hideCompleted, toggleHideCompleted } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide completed"
          checked={hideCompleted}
          onChange={toggleHideCompleted}
        />
        Hide completed
      </label>
    </section>
  )
}
