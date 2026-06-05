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

describe('Stock Levels Manager', () => {
  it('starts on the Inventory view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })

  it('seeds three products on load', () => {
    render(<App />)
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
    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })

  it('shows On hand label for seeded products', () => {
    render(<App />)
    expect(within(row('Widget A')).getByText('On hand: 5')).toBeInTheDocument()
    expect(within(row('Gadget B')).getByText('On hand: 12')).toBeInTheDocument()
    expect(within(row('Doohickey C')).getByText('On hand: 0')).toBeInTheDocument()
  })

  it('shows Reorder label for seeded products', () => {
    render(<App />)
    expect(within(row('Widget A')).getByText('Reorder: 10')).toBeInTheDocument()
    expect(within(row('Gadget B')).getByText('Reorder: 8')).toBeInTheDocument()
  })

  it('shows Low stock badge for products below reorder point', () => {
    render(<App />)
    // Widget A: 5 < 10 => low
    expect(within(row('Widget A')).getByText('Low stock')).toBeInTheDocument()
    // Gadget B: 12 >= 8 => not low
    expect(within(row('Gadget B')).queryByText('Low stock')).not.toBeInTheDocument()
    // Doohickey C: 0 < 5 => low
    expect(within(row('Doohickey C')).getByText('Low stock')).toBeInTheDocument()
  })

  it('Decrease button is disabled when on hand is 0', () => {
    render(<App />)
    expect(
      within(row('Doohickey C')).getByRole('button', { name: 'Decrease Doohickey C' })
    ).toBeDisabled()
  })

  it('increases on-hand stock with + button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Doohickey C')).getByRole('button', { name: 'Increase Doohickey C' }))
    expect(within(row('Doohickey C')).getByText('On hand: 1')).toBeInTheDocument()
  })

  it('decreases on-hand stock with − button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Gadget B')).getByRole('button', { name: 'Decrease Gadget B' }))
    expect(within(row('Gadget B')).getByText('On hand: 11')).toBeInTheDocument()
  })

  it('on-hand never goes below 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Doohickey C starts at 0; decrease should be disabled
    const dec = within(row('Doohickey C')).getByRole('button', { name: 'Decrease Doohickey C' })
    expect(dec).toBeDisabled()
    expect(within(row('Doohickey C')).getByText('On hand: 0')).toBeInTheDocument()
  })

  it('Low stock badge disappears when stock reaches reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget A starts at 5, reorder 10 — click + 5 times
    for (let i = 0; i < 5; i++) {
      await u.click(within(row('Widget A')).getByRole('button', { name: 'Increase Widget A' }))
    }
    expect(within(row('Widget A')).getByText('On hand: 10')).toBeInTheDocument()
    expect(within(row('Widget A')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('adds a new product', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Thingamajig')
    await u.type(screen.getByLabelText('Unit price'), '4.99')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByText('Thingamajig')).toBeInTheDocument()
    expect(within(row('Thingamajig')).getByText('On hand: 0')).toBeInTheDocument()
    expect(within(row('Thingamajig')).getByText('Reorder: 10')).toBeInTheDocument()
  })

  it('ignores blank product name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Unit price'), '5.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    // still only 3 products
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('removes a product', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Gadget B')).getByRole('button', { name: 'Remove Gadget B' }))
    expect(screen.queryByText('Gadget B')).not.toBeInTheDocument()
  })

  it('Summary shows correct total products for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
  })

  it('Summary shows correct total units for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // 5 + 12 + 0 = 17
    expect(screen.getByText('Total units: 17')).toBeInTheDocument()
  })

  it('Summary shows correct low stock items for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // Widget A (5<10) and Doohickey C (0<5) => 2
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
  })

  it('Summary shows correct total value for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // 5*2.50 + 12*15.00 + 0*7.00 = 12.50 + 180.00 + 0 = 192.50
    expect(screen.getByText('Total value: $192.50')).toBeInTheDocument()
  })

  it('Summary updates after increasing stock (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Gadget B')).getByRole('button', { name: 'Increase Gadget B' }))
    await nav(u, 'Summary')
    // total units: 5+13+0=18, total value: 5*2.50+13*15+0=12.50+195=207.50
    expect(screen.getByText('Total units: 18')).toBeInTheDocument()
    expect(screen.getByText('Total value: $207.50')).toBeInTheDocument()
  })

  it('Summary low stock count updates after restocking (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Restock Widget A to 10 (5 clicks)
    for (let i = 0; i < 5; i++) {
      await u.click(within(row('Widget A')).getByRole('button', { name: 'Increase Widget A' }))
    }
    await nav(u, 'Summary')
    // Only Doohickey C is still low
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
  })

  it('theme toggle changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating to other views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Inventory')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })
})
