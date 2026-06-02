'use client'
import { useSalon } from '../hooks/useSalon'

export function Settings() {
  const { theme, toggleTheme, hideZeroTip, toggleHideZeroTip } = useSalon()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide untipped sales"
          checked={hideZeroTip}
          onChange={toggleHideZeroTip}
        />
        Hide untipped sales
      </label>
    </section>
  )
}
