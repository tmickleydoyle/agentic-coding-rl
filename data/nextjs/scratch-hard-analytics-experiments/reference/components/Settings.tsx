'use client'
import { useExperiments } from '../hooks/useExperiments'

export function Settings() {
  const { theme, toggleTheme, hideEmpty, toggleHideEmpty } = useExperiments()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide empty experiments"
          checked={hideEmpty}
          onChange={toggleHideEmpty}
        />
        Hide empty experiments
      </label>
    </section>
  )
}
