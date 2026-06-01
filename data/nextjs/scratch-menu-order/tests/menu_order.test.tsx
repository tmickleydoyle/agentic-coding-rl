import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Restaurant Order App', () => {
  it('renders all five menu items', () => {
    render(<App />)
    expect(screen.getByText('Burger')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Salad')).toBeInTheDocument()
    expect(screen.getByText('Fries')).toBeInTheDocument()
    expect(screen.getByText('Soda')).toBeInTheDocument()
  })

  it('shows the correct prices on the menu', () => {
    render(<App />)
    const menu = screen.getByRole('region', { name: 'Menu' })
    expect(within(menu).getByText('$8.99')).toBeInTheDocument()
    expect(within(menu).getByText('$11.49')).toBeInTheDocument()
    expect(within(menu).getByText('$6.49')).toBeInTheDocument()
    expect(within(menu).getByText('$3.99')).toBeInTheDocument()
    expect(within(menu).getByText('$1.99')).toBeInTheDocument()
  })

  it('shows Total: $0.00 when order is empty', () => {
    render(<App />)
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('adds a menu item to the order', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[0]) // Burger
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    expect(within(orderSection).getByText('Burger')).toBeInTheDocument()
  })

  it('shows the correct line subtotal when adding Burger', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[0]) // Burger $8.99
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    expect(within(orderSection).getByText('$8.99')).toBeInTheDocument()
  })

  it('updates the total after adding an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[0]) // Burger $8.99
    expect(screen.getByText('Total: $8.99')).toBeInTheDocument()
  })

  it('increments quantity when the same item is added again', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[0])
    await u.click(buttons[0])
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    expect(within(orderSection).getByText('quantity: 2')).toBeInTheDocument()
  })

  it('doubles the line subtotal when quantity is 2 for Burger', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[0]) // Burger
    await u.click(buttons[0])
    // 2 * 8.99 = 17.98
    expect(screen.getByText('Total: $17.98')).toBeInTheDocument()
  })

  it('removes an item from the order', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[0]) // Burger
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    const removeBtn = within(orderSection).getByRole('button', { name: /remove/i })
    await u.click(removeBtn)
    expect(within(orderSection).queryByText('Burger')).not.toBeInTheDocument()
  })

  it('resets total to $0.00 after removing the only item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[0])
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    await u.click(within(orderSection).getByRole('button', { name: /remove/i }))
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('calculates total correctly with multiple different items', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[0]) // Burger $8.99
    await u.click(buttons[3]) // Fries $3.99
    // 8.99 + 3.99 = 12.98
    expect(screen.getByText('Total: $12.98')).toBeInTheDocument()
  })

  it('shows Place Order button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument()
  })

  it('does nothing when Place Order is clicked with an empty order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /place order/i }))
    expect(screen.queryByText('Order placed! Thank you.')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('shows confirmation message after placing a non-empty order', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[1]) // Pizza
    await u.click(screen.getByRole('button', { name: /place order/i }))
    expect(screen.getByText('Order placed! Thank you.')).toBeInTheDocument()
  })

  it('clears the order after placing it', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[1]) // Pizza
    await u.click(screen.getByRole('button', { name: /place order/i }))
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    expect(within(orderSection).queryByText('Pizza')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('allows ordering again after placing an order', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[2]) // Salad $6.49
    await u.click(screen.getByRole('button', { name: /place order/i }))
    await u.click(buttons[4]) // Soda $1.99
    expect(screen.getByText('Total: $1.99')).toBeInTheDocument()
    expect(screen.queryByText('Order placed! Thank you.')).not.toBeInTheDocument()
  })

  it('keeps only one line per item even after multiple adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    const menuSection = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
    await u.click(buttons[3]) // Fries
    await u.click(buttons[3])
    await u.click(buttons[3])
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    const friesItems = within(orderSection).getAllByText('Fries')
    expect(friesItems).toHaveLength(1)
    expect(within(orderSection).getByText('quantity: 3')).toBeInTheDocument()
  })
})
