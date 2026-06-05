import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('settings', () => {
  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles the theme to dark and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-browse'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('summarizes wishlist and cart counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('wish-w1'))
    await user.click(screen.getByTestId('add-w2'))
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('counts-summary')).toHaveTextContent('1 wishlisted, 1 in cart')
  })
})
