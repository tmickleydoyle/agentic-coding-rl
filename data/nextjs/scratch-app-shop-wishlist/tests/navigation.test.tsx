import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders browse by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-browse')).toBeInTheDocument()
    expect(screen.getByTestId('nav-browse')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-wishlist')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the wishlist page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-wishlist'))
    expect(screen.getByTestId('page-wishlist')).toBeInTheDocument()
    expect(screen.getByTestId('nav-wishlist')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-browse')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the cart page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-cart'))
    expect(screen.getByTestId('page-cart')).toBeInTheDocument()
  })

  it('navigates to settings and back to browse', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-browse'))
    expect(screen.getByTestId('page-browse')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })

  it('shows wishlist and cart badges starting at zero', () => {
    render(<App />)
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('0')
  })
})
