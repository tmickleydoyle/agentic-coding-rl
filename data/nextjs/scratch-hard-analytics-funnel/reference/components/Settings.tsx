'use client'
import { useFunnel } from '../hooks/useFunnel'

export function Settings() {
  const { theme, toggleTheme, hideEmpty, toggleHideEmpty } = useFunnel()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide empty funnels"
          checked={hideEmpty}
          onChange={toggleHideEmpty}
        />
        Hide empty funnels
      </label>
    </section>
  )
}
