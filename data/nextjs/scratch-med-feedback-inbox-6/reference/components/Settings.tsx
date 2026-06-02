'use client'
import { useApp } from '../hooks/useApp'

export function Settings() {
  const { uiTheme, toggleUiTheme } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleUiTheme}>{`Toggle theme (current: ${uiTheme})`}</button>
    </section>
  )
}
