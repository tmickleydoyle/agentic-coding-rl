// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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

describe('Stock Levels Manager (held-out)', () => {
  it('new product starts with low stock flag (0 < reorder point 10)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Nano Bolt')
    await u.type(screen.getByLabelText('Unit price'), '2.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(within(row('Nano Bolt')).getByText('Low stock')).toBeInTheDocument()
  })

  it('setting reorder point to 0 removes low stock flag on a 0-on-hand product', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Gadget C has 0 on hand, reorder 5 => low stock
    const input = screen.getByLabelText('Reorder point for Gadget C')
    await u.clear(input)
    await u.type(input, '0')
    await u.click(within(row('Gadget C')).getByRole('button', { name: 'Save reorder for Gadget C' }))
    expect(within(row('Gadget C')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('inventory value includes newly added product after stocking', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Power Cell')
    await u.type(screen.getByLabelText('Unit price'), '10.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    // stock it up by 3
    const btn = within(row('Power Cell')).getByRole('button', { name: 'Increase Power Cell' })
    await u.click(btn)
    await u.click(btn)
    await u.click(btn)
    await nav(u, 'Summary')
    // seeded value: 274.95 + 3*10.00 = 304.95
    expect(screen.getByText('Inventory value: $304.95')).toBeInTheDocument()
  })

  it('total products increments after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Sprocket')
    await u.type(screen.getByLabelText('Unit price'), '1.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 4')).toBeInTheDocument()
  })

  it('multiple increases accumulate correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    const btn = within(row('Gadget C')).getByRole('button', { name: 'Increase Gadget C' })
    for (let i = 0; i < 7; i++) await u.click(btn)
    expect(within(row('Gadget C')).getByText('On hand: 7')).toBeInTheDocument()
  })

  it('summary low stock count is 0 when all products are at or above reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // bring Widget A to reorder: need 5 increases
    const btnA = within(row('Widget A')).getByRole('button', { name: 'Increase Widget A' })
    for (let i = 0; i < 5; i++) await u.click(btnA)
    // bring Gadget C to reorder: need 5 increases
    const btnC = within(row('Gadget C')).getByRole('button', { name: 'Increase Gadget C' })
    for (let i = 0; i < 5; i++) await u.click(btnC)
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 0')).toBeInTheDocument()
  })

  it('show low stock only filter: unchecking restores hidden products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Show low stock only')) // enable filter
    await u.click(screen.getByLabelText('Show low stock only')) // disable filter
    await nav(u, 'Inventory')
    expect(screen.getByText('Widget B')).toBeInTheDocument()
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByText('Gadget C')).toBeInTheDocument()
  })

  it('Widget B reorder label updates after saving new reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Reorder point for Widget B')
    await u.clear(input)
    await u.type(input, '30')
    await u.click(within(row('Widget B')).getByRole('button', { name: 'Save reorder for Widget B' }))
    expect(within(row('Widget B')).getByText('Reorder: 30')).toBeInTheDocument()
  })

  it('raising reorder point above on-hand triggers low stock flag', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget B: onHand=20, reorder=8; raise reorder to 25
    const input = screen.getByLabelText('Reorder point for Widget B')
    await u.clear(input)
    await u.type(input, '25')
    await u.click(within(row('Widget B')).getByRole('button', { name: 'Save reorder for Widget B' }))
    expect(within(row('Widget B')).getByText('Low stock')).toBeInTheDocument()
  })

  it('total units in summary reflects multiple product changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget A')).getByRole('button', { name: 'Increase Widget A' }))
    await u.click(within(row('Gadget C')).getByRole('button', { name: 'Increase Gadget C' }))
    await u.click(within(row('Widget B')).getByRole('button', { name: 'Decrease Widget B' }))
    // 25 + 1 + 1 - 1 = 26
    await nav(u, 'Summary')
    expect(screen.getByText('Total units: 26')).toBeInTheDocument()
  })
})
