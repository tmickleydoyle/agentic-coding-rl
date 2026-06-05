'use client'
import { useHabits } from '../hooks/useHabits'

export function Settings() {
  const { theme, toggleTheme, hideCompleted, toggleHideCompleted } = useHabits()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide completed today"
          checked={hideCompleted}
          onChange={toggleHideCompleted}
        />
        Hide completed today
      </label>
    </section>
  )
}
