// HELD-OUT generalization tests — overlaid only at eval. Fresh scenarios covering edge cases.
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
  it('filter checkbox state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Show low stock only'))
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument()
    expect(screen.getByText('Gadget B')).toBeInTheDocument()
  })

  it('unchecking the filter restores all products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Show low stock only'))
    await u.click(screen.getByLabelText('Show low stock only'))
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Inventory (3)' })).toBeInTheDocument()
  })

  it('newly added product appears in Summary total products count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'New Part')
    await u.type(screen.getByLabelText('Unit price'), '10.00')
    await u.type(screen.getByLabelText('On hand'), '5')
    await u.type(screen.getByLabelText('Reorder point'), '2')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 4')).toBeInTheDocument()
  })

  it('new product with on hand above reorder does not show Low stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Safe Item')
    await u.type(screen.getByLabelText('Unit price'), '5.00')
    await u.type(screen.getByLabelText('On hand'), '50')
    await u.type(screen.getByLabelText('Reorder point'), '10')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(within(productRow('Safe Item')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('new product with on hand equal to reorder shows Low stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Edge Item')
    await u.type(screen.getByLabelText('Unit price'), '3.00')
    await u.type(screen.getByLabelText('On hand'), '7')
    await u.type(screen.getByLabelText('Reorder point'), '7')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(within(productRow('Edge Item')).getByText('Low stock')).toBeInTheDocument()
  })

  it('decreasing Widget A stock changes low stock count in Summary', async () => {
    // Widget A on hand 10, reorder 5 — decrease 5 times to reach 5 (still not low: 5<=5 => low)
    const u = userEvent.setup()
    render(<App />)
    for (let i = 0; i < 5; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Widget A' }))
    }
    await nav(u, 'Summary')
    // Now Widget A on hand=5, reorder=5 => low; Gadget B low; Doohickey C low => 3 low
    expect(screen.getByText('Low stock items: 3')).toBeInTheDocument()
  })

  it('total inventory value updates after stock adjustment', async () => {
    // seed: 70.00. Increase Gadget B by 1: 4*15=60, total = 25+60+0 = 85
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Gadget B' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $85.00')).toBeInTheDocument()
  })

  it('average on hand is 0 when all products have 0 on hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Decrease Widget A 10 times, Gadget B 3 times
    for (let i = 0; i < 10; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Widget A' }))
    }
    for (let i = 0; i < 3; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Gadget B' }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Average on hand: 0')).toBeInTheDocument()
  })

  it('reorder point label is shown in each product row', () => {
    render(<App />)
    const row = productRow('Widget A')
    expect(within(row).getByText('Reorder at: 5')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('low stock filter does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Show low stock only'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
  })
})
