'use client'
import { useCrm } from '../hooks/useCrm'

export function Settings() {
  const { theme, toggleTheme, showWon, toggleShowWon } = useCrm()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input type="checkbox" aria-label="Show won" checked={showWon} onChange={toggleShowWon} />
        Show won
      </label>
    </section>
  )
}
