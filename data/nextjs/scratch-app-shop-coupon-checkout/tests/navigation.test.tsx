import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the cart by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-cart')).toBeInTheDocument()
    expect(screen.getByTestId('nav-cart')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-coupons')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the coupons page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-coupons'))
    expect(screen.getByTestId('page-coupons')).toBeInTheDocument()
    expect(screen.getByTestId('nav-coupons')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-cart')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the checkout page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('page-checkout')).toBeInTheDocument()
  })

  it('shows the cart badge starting at zero', () => {
    render(<App />)
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('0')
  })

  it('starts with an empty cart message', () => {
    render(<App />)
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
  })
})
