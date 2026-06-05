'use client'
import { useGym } from '../hooks/useGym'

export function Settings() {
  const { theme, toggleTheme, hideMet, toggleHideMet } = useGym()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide members who met goal"
          checked={hideMet}
          onChange={toggleHideMet}
        />
        Hide members who met goal
      </label>
    </section>
  )
}
