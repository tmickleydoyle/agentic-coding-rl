'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, hideDone, toggleHideDone } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <div>
        <h2>Filter</h2>
        <label>
          <input
            type="checkbox"
            aria-label="Hide done tasks"
            checked={hideDone}
            onChange={toggleHideDone}
          />
          Hide done tasks
        </label>
      </div>
    </section>
  )
}
