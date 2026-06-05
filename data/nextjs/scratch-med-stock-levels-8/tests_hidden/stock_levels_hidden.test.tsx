// HELD-OUT generalization tests — fresh scenarios to measure generalization.
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

describe('Stock Levels app (held-out)', () => {
  it('new product without Low stock when on-hand >= reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Bolt Pack', '50', '10', '0.50')
    expect(within(row('Bolt Pack')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('new product shows Low stock when on-hand < reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Tiny Screw', '3', '20', '0.10')
    expect(within(row('Tiny Screw')).getByText('Low stock')).toBeInTheDocument()
  })

  it('Summary total products updates after adding one', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Washer', '200', '50', '0.25')
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 4')).toBeInTheDocument()
  })

  it('Summary total inventory value updates after adding product', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed value = 524.50; add 10 units at $2.00 => +20.00 => 544.50
    await addProduct(u, 'New Part', '10', '5', '2.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $544.50')).toBeInTheDocument()
  })

  it('adjusting to exactly reorder point removes Low stock flag', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Gadget B: on-hand=8, reorder=15; adjust +7 => on-hand=15, not strictly less
    expect(within(row('Gadget B')).getByText('Low stock')).toBeInTheDocument()
    await u.click(within(row('Gadget B')).getByRole('button', { name: /adjust gadget b/i }))
    await u.clear(screen.getByLabelText('Adjust qty'))
    await u.type(screen.getByLabelText('Adjust qty'), '7')
    await u.click(screen.getByRole('button', { name: /confirm adjust gadget b/i }))
    expect(within(row('Gadget B')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('filter preserves state across nav and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Show low stock only'))
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    // filter should still be active
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument()
    expect(screen.getByText('Gadget B')).toBeInTheDocument()
  })

  it('removing a product updates Summary low stock count', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Remove Gadget B (the only low-stock item)
    await u.click(within(row('Gadget B')).getByRole('button', { name: /remove gadget b/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 0')).toBeInTheDocument()
    expect(screen.getByText('Low stock: 0%')).toBeInTheDocument()
  })

  it('Summary total value is $0.00 after removing all products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget A')).getByRole('button', { name: /remove widget a/i }))
    await u.click(within(row('Gadget B')).getByRole('button', { name: /remove gadget b/i }))
    await u.click(within(row('Doohickey C')).getByRole('button', { name: /remove doohickey c/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $0.00')).toBeInTheDocument()
  })

  it('Reset inventory after adjustments restores original on-hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget A')).getByRole('button', { name: /adjust widget a/i }))
    await u.clear(screen.getByLabelText('Adjust qty'))
    await u.type(screen.getByLabelText('Adjust qty'), '-40')
    await u.click(screen.getByRole('button', { name: /confirm adjust widget a/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset inventory/i }))
    await nav(u, 'Inventory')
    expect(within(row('Widget A')).getByText(/on hand: 50/i)).toBeInTheDocument()
  })

  it('Reset inventory restores original Summary value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Temp Item', '99', '1', '99.99')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset inventory/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $524.50')).toBeInTheDocument()
  })

  it('price formatted to two decimal places for whole-number price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Round Price Item', '10', '5', '5')
    expect(within(row('Round Price Item')).getByText(/\$5\.00/)).toBeInTheDocument()
  })

  it('low stock percentage rounds correctly for two out of three', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Make Widget A low stock too: adjust -40 => 10 < 20
    await u.click(within(row('Widget A')).getByRole('button', { name: /adjust widget a/i }))
    await u.clear(screen.getByLabelText('Adjust qty'))
    await u.type(screen.getByLabelText('Adjust qty'), '-40')
    await u.click(screen.getByRole('button', { name: /confirm adjust widget a/i }))
    await nav(u, 'Summary')
    // 2 of 3 = 67%
    expect(screen.getByText('Low stock: 67%')).toBeInTheDocument()
  })
})
