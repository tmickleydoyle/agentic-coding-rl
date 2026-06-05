// HELD-OUT generalization tests — fresh scenarios not seen during development.
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

async function addProduct(u: U, name: string, onHand: string, reorder: string, price: string) {
  await u.clear(screen.getByLabelText('Product name'))
  await u.type(screen.getByLabelText('Product name'), name)
  await u.clear(screen.getByLabelText('On hand'))
  await u.type(screen.getByLabelText('On hand'), onHand)
  await u.clear(screen.getByLabelText('Reorder point'))
  await u.type(screen.getByLabelText('Reorder point'), reorder)
  await u.clear(screen.getByLabelText('Unit price'))
  await u.type(screen.getByLabelText('Unit price'), price)
  await u.click(screen.getByRole('button', { name: /add product/i }))
}

describe('Stock Levels Manager (held-out)', () => {
  it('Doohickey C with on-hand equal to reorder point is NOT flagged low stock', () => {
    render(<App />)
    // on-hand 3, reorder 3 — equal, so not strictly less
    const row = productRow('Doohickey C')
    expect(within(row).queryByText(/low stock/i)).not.toBeInTheDocument()
  })

  it('Doohickey C becomes low stock after one decrease', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Decrease Doohickey C' }))
    const row = productRow('Doohickey C')
    expect(within(row).getByText(/low stock/i)).toBeInTheDocument()
  })

  it('product count heading updates after adding two products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Alpha', '10', '5', '1.00')
    await addProduct(u, 'Beta', '2', '8', '5.00')
    expect(screen.getByRole('heading', { name: /products \(5\)/i })).toBeInTheDocument()
  })

  it('Summary shows updated average after adding a product', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Add product with on-hand 10; total on-hand = 5+20+3+10=38, count=4, avg=9.5
    await addProduct(u, 'Zeta', '10', '2', '0')
    await nav(u, 'Summary')
    expect(screen.getByText('Average on hand: 9.5')).toBeInTheDocument()
  })

  it('Summary total value updates after decreasing Gadget B stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Decrease Gadget B by 1: 19*14.99 = 284.81; total = 12.50 + 284.81 + 21.00 = 318.31
    await u.click(screen.getByRole('button', { name: 'Decrease Gadget B' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $318.31')).toBeInTheDocument()
  })

  it('low stock count increases after Doohickey C drops below reorder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Decrease Doohickey C' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
  })

  it('re-enabling Hide low stock shows hidden products again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide low stock'))
    await u.click(screen.getByLabelText('Hide low stock'))
    await nav(u, 'Inventory')
    expect(screen.getByText('Widget A')).toBeInTheDocument()
  })

  it('theme toggle persists back to Inventory view', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Inventory')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('multiple increases to Widget A clear the low stock flag', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget A: on-hand 5, reorder 10; need 5 more increases
    for (let i = 0; i < 5; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase Widget A' }))
    }
    const row = productRow('Widget A')
    expect(within(row).queryByText(/low stock/i)).not.toBeInTheDocument()
  })

  it('Doohickey C price displayed correctly', () => {
    render(<App />)
    const row = productRow('Doohickey C')
    expect(within(row).getByText(/price: \$7\.00/i)).toBeInTheDocument()
  })

  it('newly added product appears with correct price in inventory', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Cog E', '8', '4', '12.50')
    const row = productRow('Cog E')
    expect(within(row).getByText(/price: \$12\.50/i)).toBeInTheDocument()
    expect(within(row).getByText(/on hand: 8/i)).toBeInTheDocument()
    expect(within(row).getByText(/reorder: 4/i)).toBeInTheDocument()
  })

  it('Summary total value includes newly added product', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Add: 10 units at $2.00 = $20.00; previous total $333.30; new total $353.30
    await addProduct(u, 'Washer F', '10', '3', '2.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $353.30')).toBeInTheDocument()
  })
})
