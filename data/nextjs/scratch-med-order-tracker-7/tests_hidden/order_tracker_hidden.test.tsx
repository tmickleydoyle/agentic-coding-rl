// Held-out generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function orderRow(customer: string): HTMLElement {
  const span = screen.getByText(customer)
  const li = span.closest('li')
  if (!li) throw new Error(`no row for ${customer}`)
  return li as HTMLElement
}

describe('Order Tracker (held-out)', () => {
  it('filter by packing shows correct count after advancing an order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /advance alice/i })) // Alice -> packing
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'packing')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('Summary Packing count updates after advancing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /advance alice/i })) // Alice new -> packing
    await nav(u, 'Summary')
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
  })

  it('100% delivery rate when all orders delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Advance Alice: new->packing->shipped->delivered
    await u.click(screen.getByRole('button', { name: /advance alice/i }))
    await u.click(screen.getByRole('button', { name: /advance alice/i }))
    await u.click(screen.getByRole('button', { name: /advance alice/i }))
    // Advance Bob: shipped->delivered
    await u.click(screen.getByRole('button', { name: /advance bob/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivery rate: 100%')).toBeInTheDocument()
  })

  it('multiple adds update Showing count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const name of ['Xena', 'Yuri', 'Zara']) {
      await u.clear(screen.getByLabelText('Customer name'))
      await u.type(screen.getByLabelText('Customer name'), name)
      await u.click(screen.getByRole('button', { name: /add order/i }))
    }
    expect(screen.getByText('Showing: 6 orders')).toBeInTheDocument()
  })

  it('input clears after adding an order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer name'), 'NewCustomer')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByLabelText('Customer name')).toHaveValue('')
  })

  it('newly added order does not appear in shipped filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer name'), 'Greg')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'shipped')
    expect(screen.queryByText('Greg')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
  })

  it('advancing Bob to delivered shows him in delivered filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /advance bob/i })) // shipped -> delivered
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'delivered')
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 orders')).toBeInTheDocument()
  })

  it('toggle theme back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Summary Shipped decreases after advancing Bob', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /advance bob/i })) // shipped -> delivered
    await nav(u, 'Summary')
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
  })

  it('Carol Advance is disabled and stays delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    const btn = screen.getByRole('button', { name: /advance carol/i })
    expect(btn).toBeDisabled()
    expect(within(orderRow('Carol')).getByText('delivered')).toBeInTheDocument()
  })
})
