import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('settings', () => {
  it('defaults to light theme reflected on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles the theme and persists it across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    await user.click(screen.getByTestId('nav-cards'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('saving a new limit updates the card remaining', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    const input = screen.getByTestId('limit-k1-input')
    await user.clear(input)
    await user.type(input, '500')
    await user.click(screen.getByTestId('limit-k1-save'))

    await user.click(screen.getByTestId('nav-cards'))
    // k1 spent 100, new limit 500 => remaining 400
    expect(screen.getByTestId('card-k1-remaining')).toHaveTextContent('400')
  })
})
