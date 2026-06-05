import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('theme', () => {
  it('defaults to light theme reflected on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles the theme to dark from the dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('persists the theme when navigating away and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('theme-toggle'))
    await user.click(screen.getByTestId('nav-balances'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })
})
