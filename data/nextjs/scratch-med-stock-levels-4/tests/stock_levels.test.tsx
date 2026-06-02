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
  it('starts on the Inventory view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /inventory/i })).toBeInTheDocument()
  })

  it('shows seeded products on load', () => {
    render(<App />)
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByText('Gadget B')).toBeInTheDocument()
    expect(screen.getByText('Doohickey C')).toBeInTheDocument()
  })

  it('heading shows correct seeded product count', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inventory (3)' })).toBeInTheDocument()
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

  it('shows on-hand and reorder values for seeded products', () => {
    render(<App />)
    const rowA = productRow('Widget A')
    expect(within(rowA).getByText(/On hand: 20/)).toBeInTheDocument()
    expect(within(rowA).getByText(/Reorder at: 10/)).toBeInTheDocument()
  })

  it('flags low stock products with LOW STOCK text', () => {
    render(<App />)
    // Gadget B: on hand 5 < reorder 8 => LOW STOCK
    expect(within(productRow('Gadget B')).getByText('LOW STOCK')).toBeInTheDocument()
    // Doohickey C: on hand 8 < reorder 15 => LOW STOCK
    expect(within(productRow('Doohickey C')).getByText('LOW STOCK')).toBeInTheDocument()
  })

  it('does NOT flag Widget A as low stock', () => {
    render(<App />)
    expect(within(productRow('Widget A')).queryByText('LOW STOCK')).not.toBeInTheDocument()
  })

  it('increases on-hand quantity with + button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    expect(within(productRow('Widget A')).getByText(/On hand: 21/)).toBeInTheDocument()
  })

  it('decreases on-hand quantity with − button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Decrease Widget A' }))
    expect(within(productRow('Widget A')).getByText(/On hand: 19/)).toBeInTheDocument()
  })

  it('quantity does not go below 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Gadget B starts at 5; click − 6 times
    for (let i = 0; i < 6; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Gadget B' }))
    }
    expect(within(productRow('Gadget B')).getByText(/On hand: 0/)).toBeInTheDocument()
  })

  it('adds a new product and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Sprocket D')
    await u.type(screen.getByLabelText('Unit price'), '4.99')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByText('Sprocket D')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Inventory (4)' })).toBeInTheDocument()
  })

  it('new product starts with on-hand 0 and reorder at 10', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Sprocket D')
    await u.type(screen.getByLabelText('Unit price'), '4.99')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    const row = productRow('Sprocket D')
    expect(within(row).getByText(/On hand: 0/)).toBeInTheDocument()
    expect(within(row).getByText(/Reorder at: 10/)).toBeInTheDocument()
  })

  it('ignores a blank product name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Unit price'), '5.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByRole('heading', { name: 'Inventory (3)' })).toBeInTheDocument()
  })

  it('removes a product', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Gadget B' }))
    expect(screen.queryByText('Gadget B')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Inventory (2)' })).toBeInTheDocument()
  })

  it('summary shows correct total products (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
  })

  it('summary shows correct low stock count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // Gadget B (5<8) and Doohickey C (8<15) are low
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
  })

  it('summary shows correct total inventory value for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget A: 2.50*20=50.00, Gadget B: 15.00*5=75.00, Doohickey C: 7.75*8=62.00 => 187.00
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $187.00')).toBeInTheDocument()
  })

  it('summary shows correct average unit price for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    // (2.50 + 15.00 + 7.75) / 3 = 25.25 / 3 = 8.42 (rounded)
    await nav(u, 'Summary')
    expect(screen.getByText('Average unit price: $8.42')).toBeInTheDocument()
  })

  it('summary updates after stock adjustment (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // increase Widget A by 1 => on hand 21; value +2.50 => 189.50
    await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $189.50')).toBeInTheDocument()
  })

  it('low stock flag appears when stock drops below reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget A starts at 20, reorder at 10 — decrease to 9
    for (let i = 0; i < 11; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Widget A' }))
    }
    expect(within(productRow('Widget A')).getByText('LOW STOCK')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('reset inventory restores seeded products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Widget A' }))
    await u.click(screen.getByRole('button', { name: 'Remove Gadget B' }))
    expect(screen.getByRole('heading', { name: 'Inventory (1)' })).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Reset inventory' }))
    await nav(u, 'Inventory')
    expect(screen.getByRole('heading', { name: 'Inventory (3)' })).toBeInTheDocument()
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByText('Gadget B')).toBeInTheDocument()
    expect(screen.getByText('Doohickey C')).toBeInTheDocument()
  })

  it('summary shows $0.00 value when no products remain', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Widget A' }))
    await u.click(screen.getByRole('button', { name: 'Remove Gadget B' }))
    await u.click(screen.getByRole('button', { name: 'Remove Doohickey C' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 0')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Average unit price: $0.00')).toBeInTheDocument()
  })
})
