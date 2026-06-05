import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the catalog by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-catalog')).toBeInTheDocument()
    expect(screen.getByTestId('nav-catalog')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-cart')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the cart page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-cart'))
    expect(screen.getByTestId('page-cart')).toBeInTheDocument()
    expect(screen.getByTestId('nav-cart')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-catalog')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the checkout page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('page-checkout')).toBeInTheDocument()
    expect(screen.getByTestId('nav-checkout')).toHaveAttribute('aria-current', 'page')
  })

  it('shows a no-selection message on the product page when nothing is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-product'))
    expect(screen.getByTestId('page-product')).toBeInTheDocument()
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('shows a cart badge starting at zero', () => {
    render(<App />)
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('0')
  })
})
