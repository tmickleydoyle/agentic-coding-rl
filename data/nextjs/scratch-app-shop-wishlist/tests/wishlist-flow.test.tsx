import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('wishlist flow', () => {
  it('adds a product to the wishlist and bumps the badge', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('wish-w1'))
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('1')
  })

  it('toggling the same product off removes it from the wishlist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('wish-w1'))
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('1')
    await user.click(screen.getByTestId('wish-w1'))
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('0')
  })

  it('shows an empty wishlist message initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-wishlist'))
    expect(screen.getByTestId('wishlist-empty')).toBeInTheDocument()
  })

  it('lists wishlisted products on the wishlist page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('wish-w2'))
    await user.click(screen.getByTestId('wish-w5'))
    await user.click(screen.getByTestId('nav-wishlist'))
    const list = screen.getByTestId('wishlist-items')
    expect(within(list).getByText('Desk Lamp')).toBeInTheDocument()
    expect(within(list).getByText('Yoga Mat')).toBeInTheDocument()
  })

  it('removes a product from the wishlist page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('wish-w2'))
    await user.click(screen.getByTestId('nav-wishlist'))
    expect(screen.getByTestId('wish-item-w2')).toBeInTheDocument()
    await user.click(screen.getByTestId('wish-remove-w2'))
    expect(screen.getByTestId('wishlist-empty')).toBeInTheDocument()
  })

  it('moves a wishlist item to the cart, removing it from the wishlist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('wish-w2'))
    await user.click(screen.getByTestId('nav-wishlist'))
    await user.click(screen.getByTestId('move-w2'))
    expect(screen.getByTestId('wishlist-empty')).toBeInTheDocument()
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('0')
  })

  it('adds a product directly to the cart without touching the wishlist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-w1'))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('0')
  })

  it('shows the cart total from moved items', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-w2')) // 30
    await user.click(screen.getByTestId('add-w2')) // qty 2 => 60
    await user.click(screen.getByTestId('nav-cart'))
    expect(screen.getByTestId('cart-qty-w2')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('60')
  })

  it('removes a line from the cart', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-w1'))
    await user.click(screen.getByTestId('nav-cart'))
    await user.click(screen.getByTestId('cart-remove-w1'))
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
  })
})
