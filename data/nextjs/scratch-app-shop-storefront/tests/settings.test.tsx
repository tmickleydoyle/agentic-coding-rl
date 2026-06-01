import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('theme persistence', () => {
  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('keeps the badge count when navigating across routes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-s1'))
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
    await user.click(screen.getByTestId('nav-catalog'))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
  })
})
