import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function row(productName: string): HTMLElement {
  const el = screen.getByText(productName).closest('li')
  if (!el) throw new Error(`no row for ${productName}`)
  return el as HTMLElement
}

describe('Stock Levels Manager', () => {
  it('starts on the Inventory view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })

  it('shows all three seeded products on load', () => {
    render(<App />)
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByText('Widget B')).toBeInTheDocument()
    expect(screen.getByText('Gadget C')).toBeInTheDocument()
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

  it('shows seeded on-hand quantities', () => {
    render(<App />)
    expect(within(row('Widget A')).getByText('On hand: 5')).toBeInTheDocument()
    expect(within(row('Widget B')).getByText('On hand: 20')).toBeInTheDocument()
    expect(within(row('Gadget C')).getByText('On hand: 0')).toBeInTheDocument()
  })

  it('shows seeded reorder points', () => {
    render(<App />)
    expect(within(row('Widget A')).getByText('Reorder: 10')).toBeInTheDocument()
    expect(within(row('Widget B')).getByText('Reorder: 8')).toBeInTheDocument()
    expect(within(row('Gadget C')).getByText('Reorder: 5')).toBeInTheDocument()
  })

  it('shows seeded unit prices', () => {
    render(<App />)
    expect(within(row('Widget A')).getByText('Unit: $4.99')).toBeInTheDocument()
    expect(within(row('Widget B')).getByText('Unit: $12.50')).toBeInTheDocument()
    expect(within(row('Gadget C')).getByText('Unit: $7.25')).toBeInTheDocument()
  })

  it('flags Widget A and Gadget C as low stock on load', () => {
    render(<App />)
    expect(within(row('Widget A')).getByText('Low stock')).toBeInTheDocument()
    expect(within(row('Gadget C')).getByText('Low stock')).toBeInTheDocument()
    expect(within(row('Widget B')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('increase button adds 1 to on-hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget A')).getByRole('button', { name: 'Increase Widget A' }))
    expect(within(row('Widget A')).getByText('On hand: 6')).toBeInTheDocument()
  })

  it('decrease button subtracts 1 from on-hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget B')).getByRole('button', { name: 'Decrease Widget B' }))
    expect(within(row('Widget B')).getByText('On hand: 19')).toBeInTheDocument()
  })

  it('decrease does not go below 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Gadget C')).getByRole('button', { name: 'Decrease Gadget C' }))
    expect(within(row('Gadget C')).getByText('On hand: 0')).toBeInTheDocument()
  })

  it('low stock flag clears when on-hand reaches reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget A: onHand=5, reorderPoint=10; need 5 more clicks
    const btn = within(row('Widget A')).getByRole('button', { name: 'Increase Widget A' })
    await u.click(btn)
    await u.click(btn)
    await u.click(btn)
    await u.click(btn)
    await u.click(btn)
    expect(within(row('Widget A')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('low stock flag appears when on-hand drops below reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget B: onHand=20, reorderPoint=8
    const btn = within(row('Widget B')).getByRole('button', { name: 'Decrease Widget B' })
    for (let i = 0; i < 13; i++) await u.click(btn)
    expect(within(row('Widget B')).getByText('Low stock')).toBeInTheDocument()
  })

  it('saves a new reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Reorder point for Widget B')
    await u.clear(input)
    await u.type(input, '25')
    await u.click(within(row('Widget B')).getByRole('button', { name: 'Save reorder for Widget B' }))
    expect(within(row('Widget B')).getByText('Reorder: 25')).toBeInTheDocument()
  })

  it('adds a new product with correct defaults', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Super Bolt')
    await u.type(screen.getByLabelText('Unit price'), '3.50')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByText('Super Bolt')).toBeInTheDocument()
    expect(within(row('Super Bolt')).getByText('On hand: 0')).toBeInTheDocument()
    expect(within(row('Super Bolt')).getByText('Reorder: 10')).toBeInTheDocument()
    expect(within(row('Super Bolt')).getByText('Unit: $3.50')).toBeInTheDocument()
  })

  it('ignores adding a product with blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Unit price'), '5.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    // still only 3 seeded products
    expect(screen.getAllByRole('listitem').length).toBe(3)
  })

  it('summary shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
    expect(screen.getByText('Total units: 25')).toBeInTheDocument()
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
    // Widget A: 5*4.99=24.95, Widget B: 20*12.50=250.00, Gadget C: 0*7.25=0.00 => 274.95
    expect(screen.getByText('Inventory value: $274.95')).toBeInTheDocument()
  })

  it('summary updates after increasing stock (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget B')).getByRole('button', { name: 'Increase Widget B' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total units: 26')).toBeInTheDocument()
    // +12.50
    expect(screen.getByText('Inventory value: $287.45')).toBeInTheDocument()
  })

  it('summary low stock items updates when stock is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    const btn = within(row('Widget A')).getByRole('button', { name: 'Increase Widget A' })
    for (let i = 0; i < 5; i++) await u.click(btn)
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
  })

  it('theme toggles and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Inventory')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('show low stock only filter hides non-low products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Show low stock only'))
    await nav(u, 'Inventory')
    expect(screen.queryByText('Widget B')).not.toBeInTheDocument()
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByText('Gadget C')).toBeInTheDocument()
  })

  it('show low stock only does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Show low stock only'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
    expect(screen.getByText('Total units: 25')).toBeInTheDocument()
  })

  it('inventory state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Gadget C')).getByRole('button', { name: 'Increase Gadget C' }))
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    expect(within(row('Gadget C')).getByText('On hand: 1')).toBeInTheDocument()
  })
})
