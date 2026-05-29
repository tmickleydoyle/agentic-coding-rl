'use client'
import ThemeProvider from './ThemeProvider'
import ThemeToggle from './ThemeToggle'
import { useTheme } from './ThemeContext'

function Root() {
  const { theme } = useTheme()
  return (
    <div data-testid="root" data-theme={theme}>
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
