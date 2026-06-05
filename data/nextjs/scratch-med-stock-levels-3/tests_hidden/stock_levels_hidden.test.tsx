// HELD-OUT generalization tests — fresh scenarios and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stock Levels Manager (held-out)', () => {
  it('Gadget B line value is correct on load', () => {
    render(<App />)
    // 5 * 15.00 = 75.00
    expect(within(row('Gadget B')).getByText('Value: $75.00')).toBeInTheDocument()
  })

  it('line value updates after increasing stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Gadget B: 5 -> 6, 6 * 15 = 90.00
    await u.click(screen.getByRole('button', { name: 'Increase stock for Gadget B' }))
    expect(within(row('Gadget B')).getByText('Value: $90.00')).toBeInTheDocument()
  })

  it('line value updates after decreasing stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget A: 100 -> 99, 99 * 2.50 = 247.50
    await u.click(screen.getByRole('button', { name: 'Decrease stock for Widget A' }))
    expect(within(row('Widget A')).getByText('Value: $247.50')).toBeInTheDocument()
  })

  it('LOW STOCK clears when stock is raised to meet reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Gadget B: on-hand=5, reorder=10 — need 5 more increments
    for (let i = 0; i < 5; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase stock for Gadget B' }))
    }
    expect(within(row('Gadget B')).queryByText('LOW STOCK')).not.toBeInTheDocument()
  })

  it('low stock count updates in summary after restocking', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Fix Gadget B
    for (let i = 0; i < 5; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase stock for Gadget B' }))
    }
    // Fix Doohickey C
    for (let i = 0; i < 5; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase stock for Doohickey C' }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 0')).toBeInTheDocument()
    expect(screen.getByText('In stock: 3')).toBeInTheDocument()
  })

  it('adding a product updates total products in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'New Part')
    await u.type(screen.getByLabelText('Unit price'), '10')
    await u.type(screen.getByLabelText('On hand'), '50')
    await u.type(screen.getByLabelText('Reorder point'), '5')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 4')).toBeInTheDocument()
  })

  it('adding a product increases total inventory value in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Bolt Pack')
    await u.type(screen.getByLabelText('Unit price'), '1.00')
    await u.type(screen.getByLabelText('On hand'), '10')
    await u.type(screen.getByLabelText('Reorder point'), '2')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    // original 325.00 + 10*1.00 = 335.00
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $335.00')).toBeInTheDocument()
  })

  it('a newly added product with low stock is flagged', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Rare Item')
    await u.type(screen.getByLabelText('Unit price'), '100.00')
    await u.type(screen.getByLabelText('On hand'), '1')
    await u.type(screen.getByLabelText('Reorder point'), '10')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(within(row('Rare Item')).getByText('LOW STOCK')).toBeInTheDocument()
  })

  it('removing a low-stock item reduces low stock count in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Doohickey C' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
  })

  it('inventory state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase stock for Gadget B' }))
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    expect(within(row('Gadget B')).getByText('On hand: 6')).toBeInTheDocument()
  })

  it('reset inventory followed by adding a product works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Reset inventory' }))
    await nav(u, 'Inventory')
    await u.type(screen.getByLabelText('Product name'), 'Fresh Start')
    await u.type(screen.getByLabelText('Unit price'), '5.00')
    await u.type(screen.getByLabelText('On hand'), '20')
    await u.type(screen.getByLabelText('Reorder point'), '3')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByText('Fresh Start')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 1')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $100.00')).toBeInTheDocument()
  })

  it('theme toggle cycles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    const btn = screen.getByRole('button', { name: /toggle theme/i })
    await u.click(btn)
    await u.click(btn)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('decrease stock for Widget A multiple times', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (let i = 0; i < 3; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease stock for Widget A' }))
    }
    expect(within(row('Widget A')).getByText('On hand: 97')).toBeInTheDocument()
    // Value: 97 * 2.50 = 242.50
    expect(within(row('Widget A')).getByText('Value: $242.50')).toBeInTheDocument()
  })
})
