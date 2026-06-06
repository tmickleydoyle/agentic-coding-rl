import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Restaurant Menu App', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /restaurant menu/i })).toBeInTheDocument()
  })

  it('shows all 9 menu items by default', () => {
    render(<App />)
    expect(screen.getAllByTestId('menu-item')).toHaveLength(9)
  })

  it('filters to Appetizers (3 items)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^appetizers$/i }))
    expect(screen.getAllByTestId('menu-item')).toHaveLength(3)
  })

  it('filters to Mains (3 items)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^mains$/i }))
    expect(screen.getAllByTestId('menu-item')).toHaveLength(3)
  })

  it('filters to Desserts (3 items)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^desserts$/i }))
    expect(screen.getAllByTestId('menu-item')).toHaveLength(3)
  })

  it('All filter restores all items', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^mains$/i }))
    await user.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getAllByTestId('menu-item')).toHaveLength(9)
  })

  it('cart starts empty', () => {
    render(<App />)
    expect(screen.getByTestId('cart-count').textContent).toBe('0')
    expect(screen.getByTestId('cart-total').textContent).toBe('$0.00')
  })

  it('adds an item to cart', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
    await user.click(addButtons[0])
    expect(screen.getByTestId('cart-count').textContent).toBe('1')
    expect(screen.getAllByTestId('cart-item')).toHaveLength(1)
  })

  it('cart total sums correctly after adding two items', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
    await user.click(addButtons[0]) // Soup $5.99
    await user.click(addButtons[1]) // Bruschetta $7.49
    expect(screen.getByTestId('cart-count').textContent).toBe('2')
    expect(screen.getByTestId('cart-total').textContent).toBe('$13.48')
  })

  it('can add same item twice', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
    await user.click(addButtons[0])
    await user.click(addButtons[0])
    expect(screen.getByTestId('cart-count').textContent).toBe('2')
    expect(screen.getAllByTestId('cart-item')).toHaveLength(2)
  })

  it('clear cart empties the cart', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
    await user.click(addButtons[0])
    await user.click(screen.getByRole('button', { name: /clear cart/i }))
    expect(screen.getByTestId('cart-count').textContent).toBe('0')
    expect(screen.getByTestId('cart-total').textContent).toBe('$0.00')
  })

  it('active filter button has aria-pressed true', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^mains$/i }))
    expect(screen.getByRole('button', { name: /^mains$/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /^all$/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('filtering does not clear the cart', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
    await user.click(addButtons[0])
    await user.click(screen.getByRole('button', { name: /^mains$/i }))
    expect(screen.getByTestId('cart-count').textContent).toBe('1')
  })
})
