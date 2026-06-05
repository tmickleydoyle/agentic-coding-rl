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

describe('Stock Levels app', () => {
  it('starts on the Inventory view with seeded products', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /inventory/i })).toBeInTheDocument()
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByText('Gadget B')).toBeInTheDocument()
    expect(screen.getByText('Doohickey C')).toBeInTheDocument()
  })

  it('heading shows the count of displayed products', () => {
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

  it('shows Low stock badge for Gadget B (on hand 3 <= reorder 8)', () => {
    render(<App />)
    const row = productRow('Gadget B')
    expect(within(row).getByText('Low stock')).toBeInTheDocument()
  })

  it('shows Low stock badge for Doohickey C (on hand 0 <= reorder 0)', () => {
    render(<App />)
    const row = productRow('Doohickey C')
    expect(within(row).getByText('Low stock')).toBeInTheDocument()
  })

  it('does not show Low stock badge for Widget A (on hand 10 > reorder 5)', () => {
    render(<App />)
    const row = productRow('Widget A')
    expect(within(row).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('Increase button increments on hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    expect(within(productRow('Widget A')).getByText('On hand: 11')).toBeInTheDocument()
  })

  it('Decrease button decrements on hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Decrease Widget A' }))
    expect(within(productRow('Widget A')).getByText('On hand: 9')).toBeInTheDocument()
  })

  it('on hand cannot go below zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Decrease Doohickey C' }))
    expect(within(productRow('Doohickey C')).getByText('On hand: 0')).toBeInTheDocument()
  })

  it('adding stock removes the Low stock badge when crossing the reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = productRow('Gadget B')
    expect(within(row).getByText('Low stock')).toBeInTheDocument()
    // on hand 3, reorder 8 — need 6 increases to reach 9 > 8
    for (let i = 0; i < 6; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase Gadget B' }))
    }
    expect(within(productRow('Gadget B')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('Show low stock only filter hides non-low products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Show low stock only'))
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument()
    expect(screen.getByText('Gadget B')).toBeInTheDocument()
    expect(screen.getByText('Doohickey C')).toBeInTheDocument()
  })

  it('heading count reflects the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Show low stock only'))
    expect(screen.getByRole('heading', { name: 'Inventory (2)' })).toBeInTheDocument()
  })

  it('adds a new product and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Sprocket D')
    await u.type(screen.getByLabelText('Unit price'), '4.99')
    await u.type(screen.getByLabelText('On hand'), '20')
    await u.type(screen.getByLabelText('Reorder point'), '5')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByText('Sprocket D')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Inventory (4)' })).toBeInTheDocument()
  })

  it('ignores a blank product name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Unit price'), '1.00')
    await u.type(screen.getByLabelText('On hand'), '5')
    await u.type(screen.getByLabelText('Reorder point'), '2')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByRole('heading', { name: 'Inventory (3)' })).toBeInTheDocument()
  })

  it('Summary shows correct total products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
  })

  it('Summary shows correct low stock count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
  })

  it('Summary shows correct total inventory value for seed data', async () => {
    // Widget A: 10*2.50=25.00, Gadget B: 3*15.00=45.00, Doohickey C: 0*7.25=0.00 => $70.00
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $70.00')).toBeInTheDocument()
  })

  it('Summary shows correct average on hand for seed data', async () => {
    // (10+3+0)/3 = 4.33 => 4
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Average on hand: 4')).toBeInTheDocument()
  })

  it('Summary updates after adjusting stock (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    // Widget A on hand now 12: value = 12*2.50 + 3*15 + 0 = 30+45 = 75
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $75.00')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Inventory')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('inventory state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Gadget B' }))
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    expect(within(productRow('Gadget B')).getByText('On hand: 4')).toBeInTheDocument()
  })
})
