// HELD-OUT generalization tests — overlaid only at eval.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function addByIndex(u: ReturnType<typeof userEvent.setup>, index: number) {
  const menuSection = screen.getByRole('region', { name: 'Menu' })
  const buttons = within(menuSection).getAllByRole('button', { name: /add to order/i })
  await u.click(buttons[index])
}

describe('Restaurant Order App (held-out)', () => {
  it('Soda price appears in the menu section', () => {
    render(<App />)
    const menu = screen.getByRole('region', { name: 'Menu' })
    expect(within(menu).getByText('$1.99')).toBeInTheDocument()
  })

  it('adding Pizza then Salad shows correct combined total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addByIndex(u, 1) // Pizza $11.49
    await addByIndex(u, 2) // Salad $6.49
    // 11.49 + 6.49 = 17.98
    expect(screen.getByText('Total: $17.98')).toBeInTheDocument()
  })

  it('adding Soda three times shows quantity 3 and correct subtotal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addByIndex(u, 4) // Soda $1.99
    await addByIndex(u, 4)
    await addByIndex(u, 4)
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    expect(within(orderSection).getByText('quantity: 3')).toBeInTheDocument()
    // 3 * 1.99 = 5.97
    expect(screen.getByText('Total: $5.97')).toBeInTheDocument()
  })

  it('removing one of two items recalculates total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addByIndex(u, 0) // Burger $8.99
    await addByIndex(u, 3) // Fries $3.99
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    // Remove Fries
    const lines = within(orderSection).getAllByRole('listitem')
    const friesLine = lines.find((li) => li.textContent?.includes('Fries'))
    if (!friesLine) throw new Error('Fries line not found')
    await u.click(within(friesLine as HTMLElement).getByRole('button', { name: /remove/i }))
    expect(screen.getByText('Total: $8.99')).toBeInTheDocument()
    expect(within(orderSection).queryByText('Fries')).not.toBeInTheDocument()
  })

  it('place order with multiple items clears all lines', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addByIndex(u, 0) // Burger
    await addByIndex(u, 1) // Pizza
    await addByIndex(u, 4) // Soda
    await u.click(screen.getByRole('button', { name: /place order/i }))
    const orderSection = screen.getByRole('region', { name: 'Your Order' })
    expect(within(orderSection).queryByText('Burger')).not.toBeInTheDocument()
    expect(within(orderSection).queryByText('Pizza')).not.toBeInTheDocument()
    expect(within(orderSection).queryByText('Soda')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('confirmation message appears once after one place order click', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addByIndex(u, 2) // Salad
    await u.click(screen.getByRole('button', { name: /place order/i }))
    const msgs = screen.getAllByText('Order placed! Thank you.')
    expect(msgs).toHaveLength(1)
  })

  it('total updates incrementally as items are added one by one', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
    await addByIndex(u, 3) // Fries $3.99
    expect(screen.getByText('Total: $3.99')).toBeInTheDocument()
    await addByIndex(u, 4) // Soda $1.99
    // 3.99 + 1.99 = 5.98
    expect(screen.getByText('Total: $5.98')).toBeInTheDocument()
  })

  it('all five items have an Add to order button', () => {
    render(<App />)
    const menu = screen.getByRole('region', { name: 'Menu' })
    const buttons = within(menu).getAllByRole('button', { name: /add to order/i })
    expect(buttons).toHaveLength(5)
  })

  it('clicking Place Order twice with one item placed shows confirmation and empty order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addByIndex(u, 0) // Burger
    await u.click(screen.getByRole('button', { name: /place order/i }))
    // second click on empty order — no extra confirmation
    await u.click(screen.getByRole('button', { name: /place order/i }))
    // confirmation still present (no re-clear)
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
  })
})
