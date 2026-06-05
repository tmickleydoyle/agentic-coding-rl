'use client'
import { useStudio } from '../hooks/useStudio'

export function Settings() {
  const { theme, toggleTheme, hideFull, toggleHideFull } = useStudio()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide full classes"
          checked={hideFull}
          onChange={toggleHideFull}
        />
        Hide full classes
      </label>
    </section>
  )
}
