// HELD-OUT generalization tests — overlaid only at eval.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

function rowFor(name: string): HTMLElement {
  return screen.getByRole('row', { name: new RegExp(name) })
}

describe('Inventory Tracker (held-out)', () => {
  it('Cherries value is $100.00 on load', () => {
    render(<App />)
    const cherriesRow = rowFor('Cherries')
    expect(within(cherriesRow).getByText('$100.00')).toBeInTheDocument()
  })

  it('Bananas value is $0.75 on load', () => {
    render(<App />)
    const bananasRow = rowFor('Bananas')
    expect(within(bananasRow).getByText('$0.75')).toBeInTheDocument()
  })

  it('stock cannot go below zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    const bananasRow = rowFor('Bananas')
    const decBtn = within(bananasRow).getByRole('button', { name: '−' })
    await u.click(decBtn) // 2
    await u.click(decBtn) // 1
    await u.click(decBtn) // 0
    await u.click(decBtn) // still 0 (button disabled, no-op)
    expect(within(bananasRow).getByText('0')).toBeInTheDocument()
  })

  it('total decreases when stock is decremented', async () => {
    const u = userEvent.setup()
    render(<App />)
    const cherriesRow = rowFor('Cherries')
    await u.click(within(cherriesRow).getByRole('button', { name: '−' }))
    // 49 × 2.00 = 98; total = 5 + 0.75 + 98 = 103.75
    expect(screen.getByText('Total inventory value: $103.75')).toBeInTheDocument()
  })

  it('newly added item with stock ≤ 5 shows Low stock immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item name'), 'Limes')
    await u.type(screen.getByLabelText('Stock'), '2')
    await u.type(screen.getByLabelText('Price ($)'), '0.75')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    const limesRow = rowFor('Limes')
    expect(within(limesRow).getByText('Low stock')).toBeInTheDocument()
  })

  it('newly added item with stock > 5 does not show Low stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item name'), 'Oranges')
    await u.type(screen.getByLabelText('Stock'), '10')
    await u.type(screen.getByLabelText('Price ($)'), '1.20')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    const orangesRow = rowFor('Oranges')
    expect(within(orangesRow).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('stock at exactly 5 is still low stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    const cherriesRow = rowFor('Cherries')
    const decBtn = within(cherriesRow).getByRole('button', { name: '−' })
    // 50 -> 5 (45 decrements)
    for (let i = 0; i < 45; i++) {
      await u.click(decBtn)
    }
    expect(within(cherriesRow).getByText('Low stock')).toBeInTheDocument()
    // one more increment brings to 6 -> no longer low stock
    await u.click(within(cherriesRow).getByRole('button', { name: '+' }))
    expect(within(cherriesRow).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('multiple items can each show Low stock independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Apples start at 10; decrement to 5
    const applesRow = rowFor('Apples')
    const decBtn = within(applesRow).getByRole('button', { name: '−' })
    for (let i = 0; i < 5; i++) {
      await u.click(decBtn)
    }
    // Both Apples (now 5) and Bananas (3) should show Low stock
    expect(within(applesRow).getByText('Low stock')).toBeInTheDocument()
    expect(within(rowFor('Bananas')).getByText('Low stock')).toBeInTheDocument()
  })

  it('total reflects multiple added items correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item name'), 'Item X')
    await u.type(screen.getByLabelText('Stock'), '10')
    await u.type(screen.getByLabelText('Price ($)'), '2.00')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    await u.type(screen.getByLabelText('Item name'), 'Item Y')
    await u.type(screen.getByLabelText('Stock'), '5')
    await u.type(screen.getByLabelText('Price ($)'), '4.00')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    // 105.75 + 10×2.00 + 5×4.00 = 105.75 + 20 + 20 = 145.75
    expect(screen.getByText('Total inventory value: $145.75')).toBeInTheDocument()
  })
})
