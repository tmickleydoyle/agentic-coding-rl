'use client'
import { useGrowth } from '../hooks/useGrowth'

export function Settings() {
  const { theme, toggleTheme, openedOnly, toggleOpenedOnly } = useGrowth()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show opened only"
          checked={openedOnly}
          onChange={toggleOpenedOnly}
        />
        Show opened only
      </label>
    </section>
  )
}
