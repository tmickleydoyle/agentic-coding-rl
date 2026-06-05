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

describe('Stock Levels Manager', () => {
  it('starts on Inventory view with seeded products', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /products \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByText('Gadget B')).toBeInTheDocument()
    expect(screen.getByText('Doohickey C')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Inventory from Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    expect(screen.getByRole('heading', { name: /products \(3\)/i })).toBeInTheDocument()
  })

  it('shows Widget A as low stock because on-hand < reorder point', () => {
    render(<App />)
    const row = productRow('Widget A')
    expect(within(row).getByText(/low stock/i)).toBeInTheDocument()
  })

  it('does not show Gadget B as low stock', () => {
    render(<App />)
    const row = productRow('Gadget B')
    expect(within(row).queryByText(/low stock/i)).not.toBeInTheDocument()
  })

  it('shows correct on-hand and reorder for seeded products', () => {
    render(<App />)
    const rowA = productRow('Widget A')
    expect(within(rowA).getByText(/on hand: 5/i)).toBeInTheDocument()
    expect(within(rowA).getByText(/reorder: 10/i)).toBeInTheDocument()
    const rowB = productRow('Gadget B')
    expect(within(rowB).getByText(/on hand: 20/i)).toBeInTheDocument()
  })

  it('shows unit price formatted to two decimal places', () => {
    render(<App />)
    const rowA = productRow('Widget A')
    expect(within(rowA).getByText(/price: \$2\.50/i)).toBeInTheDocument()
    const rowB = productRow('Gadget B')
    expect(within(rowB).getByText(/price: \$14\.99/i)).toBeInTheDocument()
  })

  it('increases on-hand with + button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Gadget B' }))
    expect(within(productRow('Gadget B')).getByText(/on hand: 21/i)).toBeInTheDocument()
  })

  it('decreases on-hand with − button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Decrease Gadget B' }))
    expect(within(productRow('Gadget B')).getByText(/on hand: 19/i)).toBeInTheDocument()
  })

  it('on-hand cannot go below 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget A has on-hand 5, click decrease 6 times
    for (let i = 0; i < 6; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Widget A' }))
    }
    expect(within(productRow('Widget A')).getByText(/on hand: 0/i)).toBeInTheDocument()
  })

  it('low stock flag appears when on-hand drops below reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Gadget B on-hand 20, reorder 8 — decrease to 7
    for (let i = 0; i < 14; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Gadget B' }))
    }
    expect(within(productRow('Gadget B')).getByText(/low stock/i)).toBeInTheDocument()
  })

  it('adds a new product and updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Product name'))
    await u.type(screen.getByLabelText('Product name'), 'Sprocket D')
    await u.clear(screen.getByLabelText('On hand'))
    await u.type(screen.getByLabelText('On hand'), '15')
    await u.clear(screen.getByLabelText('Reorder point'))
    await u.type(screen.getByLabelText('Reorder point'), '5')
    await u.clear(screen.getByLabelText('Unit price'))
    await u.type(screen.getByLabelText('Unit price'), '3.99')
    await u.click(screen.getByRole('button', { name: /add product/i }))
    expect(screen.getByRole('heading', { name: /products \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Sprocket D')).toBeInTheDocument()
  })

  it('ignores adding a product with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add product/i }))
    expect(screen.getByRole('heading', { name: /products \(3\)/i })).toBeInTheDocument()
  })

  it('Summary shows correct total products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
  })

  it('Summary shows correct low stock count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // Widget A (5 < 10) is low; Doohickey C (3 = 3) is NOT strictly less
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
  })

  it('Summary total inventory value reflects seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    // 5*2.50 + 20*14.99 + 3*7.00 = 12.50 + 299.80 + 21.00 = 333.30
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $333.30')).toBeInTheDocument()
  })

  it('Summary average on hand reflects seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    // (5 + 20 + 3) / 3 = 9.333... => 9.3
    await nav(u, 'Summary')
    expect(screen.getByText('Average on hand: 9.3')).toBeInTheDocument()
  })

  it('Summary updates after stock adjustment (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Increase Widget A by 1: on-hand 5 -> 6, value 6*2.50=15, total 15+299.80+21=335.80
    await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $335.80')).toBeInTheDocument()
  })

  it('low stock items in Summary updates after adjustment', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Increase Widget A enough to clear low stock (need on-hand >= 10, currently 5, add 5)
    for (let i = 0; i < 5; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 0')).toBeInTheDocument()
  })

  it('toggles theme and persists it across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Hide low stock checkbox hides low-stock products on Inventory', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget A is low stock
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide low stock'))
    await nav(u, 'Inventory')
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument()
  })

  it('hidden low-stock items still counted in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide low stock'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
  })

  it('inventory state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Gadget B' }))
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    expect(within(productRow('Gadget B')).getByText(/on hand: 21/i)).toBeInTheDocument()
  })
})
