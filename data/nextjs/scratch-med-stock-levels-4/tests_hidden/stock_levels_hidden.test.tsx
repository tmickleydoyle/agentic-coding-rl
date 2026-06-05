// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function productRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stock Levels (held-out)', () => {
  it('all three nav buttons are rendered', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Inventory' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Summary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigating away and back preserves stock adjustments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    expect(within(productRow('Widget A')).getByText(/On hand: 22/)).toBeInTheDocument()
  })

  it('summary low stock count updates after adjustment removes the flag', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Gadget B: on hand 5 reorder 8 — increase to 8 (not below reorder, flag gone)
    for (let i = 0; i < 3; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase Gadget B' }))
    }
    await nav(u, 'Summary')
    // Now only Doohickey C is low
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
  })

  it('adding a new product changes total products in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Bolt E')
    await u.type(screen.getByLabelText('Unit price'), '1.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 4')).toBeInTheDocument()
  })

  it('new product with 0 on-hand contributes 0 to total value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Empty Part')
    await u.type(screen.getByLabelText('Unit price'), '100.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    await nav(u, 'Summary')
    // Total value should still be $187.00
    expect(screen.getByText('Total inventory value: $187.00')).toBeInTheDocument()
  })

  it('new product with 0 on-hand is flagged LOW STOCK immediately', () => {
    // reorderAt default is 10, onHand starts at 0 => LOW STOCK
    const u = userEvent.setup()
    render(<App />)
    return (async () => {
      await u.type(screen.getByLabelText('Product name'), 'Fresh Widget')
      await u.type(screen.getByLabelText('Unit price'), '3.00')
      await u.click(screen.getByRole('button', { name: 'Add product' }))
      expect(within(productRow('Fresh Widget')).getByText('LOW STOCK')).toBeInTheDocument()
    })()
  })

  it('removing a product decreases summary total products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Doohickey C' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 2')).toBeInTheDocument()
  })

  it('removing a low-stock product decreases low stock count in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Gadget B' }))
    await nav(u, 'Summary')
    // Only Doohickey C remains low
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
  })

  it('reset restores seeded on-hand values after manual adjustments', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (let i = 0; i < 5; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase Gadget B' }))
    }
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Reset inventory' }))
    await nav(u, 'Inventory')
    expect(within(productRow('Gadget B')).getByText(/On hand: 5/)).toBeInTheDocument()
  })

  it('reset restores correct total inventory value in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Widget A' }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Reset inventory' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $187.00')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('decreasing Doohickey C stock to equal reorder point removes LOW STOCK flag', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Doohickey C: on hand 8, reorder at 15 — increase to exactly 15
    for (let i = 0; i < 7; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase Doohickey C' }))
    }
    // on hand == reorder (15 == 15) => NOT low stock
    expect(within(productRow('Doohickey C')).queryByText('LOW STOCK')).not.toBeInTheDocument()
  })

  it('total inventory value updates after removing Gadget B', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Remove Gadget B (15*5=75) => 187-75=112
    await u.click(screen.getByRole('button', { name: 'Remove Gadget B' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $112.00')).toBeInTheDocument()
  })
})
