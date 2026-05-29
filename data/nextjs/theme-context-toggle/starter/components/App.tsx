'use client'
import ThemeProvider from './ThemeProvider'
import ThemeToggle from './ThemeToggle'
import { useTheme } from './ThemeContext'

function Root() {
  // TODO: use useTheme() to read theme; render data-testid="root" data-theme={theme}
  // and contain <ThemeToggle />.
  return (
    <div data-testid="root" data-theme="light">
      <ThemeToggle />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  )
}
