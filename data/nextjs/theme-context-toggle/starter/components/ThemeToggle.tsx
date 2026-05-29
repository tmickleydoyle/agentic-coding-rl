'use client'
import { useTheme } from './ThemeContext'

// TODO: render button labeled "Switch to <opposite>" that calls toggle().
export default function ThemeToggle() {
  const { theme } = useTheme()
  return <button data-testid="toggle">Switch to dark</button>
}
