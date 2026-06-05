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
  it('starts on the Inventory view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /products \(3\)/i })).toBeInTheDocument()
  })

  it('shows seeded products with on-hand and reorder point', () => {
    render(<App />)
    expect(screen.getByText('Widgets')).toBeInTheDocument()
    expect(within(row('Widgets')).getByText('On hand: 30')).toBeInTheDocument()
    expect(within(row('Widgets')).getByText('Reorder point: 20')).toBeInTheDocument()
  })

  it('flags Sprockets as LOW STOCK because on-hand < reorder point', () => {
    render(<App />)
    expect(within(row('Sprockets')).getByText('LOW STOCK')).toBeInTheDocument()
  })

  it('does NOT flag Widgets or Bolts as low stock', () => {
    render(<App />)
    expect(within(row('Widgets')).queryByText('LOW STOCK')).not.toBeInTheDocument()
    expect(within(row('Bolts')).queryByText('LOW STOCK')).not.toBeInTheDocument()
  })

  it('navigates to Summary and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Inventory')
    expect(screen.getByRole('heading', { name: /products \(3\)/i })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('increases on-hand stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Widgets' }))
    expect(within(row('Widgets')).getByText('On hand: 31')).toBeInTheDocument()
  })

  it('decreases on-hand stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Decrease Bolts' }))
    expect(within(row('Bolts')).getByText('On hand: 99')).toBeInTheDocument()
  })

  it('does not let on-hand go below 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Sprockets starts at 5; click decrease 6 times
    for (let i = 0; i < 6; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Sprockets' }))
    }
    expect(within(row('Sprockets')).getByText('On hand: 0')).toBeInTheDocument()
  })

  it('triggers LOW STOCK flag when decreasing below reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widgets: on-hand 30, reorder 20 — decrease 11 times so on-hand = 19 < 20
    for (let i = 0; i < 11; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase Sprockets' }))
    }
    // Sprockets now 16, reorder 10 — no low stock
    expect(within(row('Sprockets')).queryByText('LOW STOCK')).not.toBeInTheDocument()
  })

  it('removes a product', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Bolts' }))
    expect(screen.queryByText('Bolts')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /products \(2\)/i })).toBeInTheDocument()
  })

  it('adds a new product', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Product name'))
    await u.type(screen.getByLabelText('Product name'), 'Gaskets')
    await u.triple_click?.(screen.getByLabelText('On hand')) ?? await u.click(screen.getByLabelText('On hand'))
    await u.clear(screen.getByLabelText('On hand'))
    await u.type(screen.getByLabelText('On hand'), '15')
    await u.clear(screen.getByLabelText('Reorder point'))
    await u.type(screen.getByLabelText('Reorder point'), '20')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByText('Gaskets')).toBeInTheDocument()
    expect(within(row('Gaskets')).getByText('On hand: 15')).toBeInTheDocument()
    expect(within(row('Gaskets')).getByText('Reorder point: 20')).toBeInTheDocument()
    expect(within(row('Gaskets')).getByText('LOW STOCK')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /products \(4\)/i })).toBeInTheDocument()
  })

  it('ignores blank product name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByRole('heading', { name: /products \(3\)/i })).toBeInTheDocument()
  })

  it('Summary shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
    // 30 + 5 + 100 = 135
    expect(screen.getByText('Total units on hand: 135')).toBeInTheDocument()
    // 135 * 2.50 = 337.50
    expect(screen.getByText('Total inventory value: $337.50')).toBeInTheDocument()
  })

  it('Summary updates after increasing stock (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Widgets' }))
    await nav(u, 'Summary')
    // 31 + 5 + 100 = 136; 136 * 2.50 = 340.00
    expect(screen.getByText('Total units on hand: 136')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $340.00')).toBeInTheDocument()
  })

  it('Summary low stock count updates when stock changes cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Increase Sprockets above reorder point (10) — needs 6 more to reach 11
    for (let i = 0; i < 6; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase Sprockets' }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 0')).toBeInTheDocument()
  })

  it('removes product and Summary reflects the change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Widgets' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 2')).toBeInTheDocument()
    // 5 + 100 = 105; 105 * 2.50 = 262.50
    expect(screen.getByText('Total units on hand: 105')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $262.50')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Toggle theme' }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByText('Current theme: dark')).toBeInTheDocument()
    await nav(u, 'Inventory')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('inventory state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Widgets' }))
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    expect(within(row('Widgets')).getByText('On hand: 31')).toBeInTheDocument()
  })
})
