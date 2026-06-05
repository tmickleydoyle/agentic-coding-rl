'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { theme, toggleTheme, hideLowStock, toggleHideLowStock } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Hide low stock"
          checked={hideLowStock}
          onChange={toggleHideLowStock}
        />
        Hide low stock
      </label>
    </section>
  )
}
