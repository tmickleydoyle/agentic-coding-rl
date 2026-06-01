import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the menu page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-menu')).toBeInTheDocument()
    expect(screen.getByTestId('nav-menu')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-cart')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the cart page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-cart'))
    expect(screen.getByTestId('page-cart')).toBeInTheDocument()
    expect(screen.getByTestId('nav-cart')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the checkout page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('page-checkout')).toBeInTheDocument()
  })

  it('navigates to item-detail and back to menu', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-item-detail'))
    expect(screen.getByTestId('page-item-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-menu'))
    expect(screen.getByTestId('page-menu')).toBeInTheDocument()
    expect(screen.getByTestId('nav-item-detail')).not.toHaveAttribute('aria-current')
  })

  it('shows an empty cart badge initially', () => {
    render(<App />)
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('0')
  })
})
