import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function orderRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

describe('Order Tracker (held-out)', () => {
  it('seeded Bob starts as packing', () => {
    render(<App />)
    expect(within(orderRow('Bob')).getByText('packing')).toBeInTheDocument()
  })

  it('seeded Carol starts as shipped', () => {
    render(<App />)
    expect(within(orderRow('Carol')).getByText('shipped')).toBeInTheDocument()
  })

  it('advancing Bob twice reaches delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(within(orderRow('Bob')).getByText('delivered')).toBeInTheDocument()
  })

  it('advancing Carol once reaches delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    expect(within(orderRow('Carol')).getByText('delivered')).toBeInTheDocument()
  })

  it('Summary Shipped count decreases after Carol is advanced', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/shipped: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/delivered: 1/i)).toBeInTheDocument()
  })

  it('adding two extra orders updates total in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/customer name/i), 'Grace')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    await u.type(screen.getByLabelText(/customer name/i), 'Hank')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/total orders: 5/i)).toBeInTheDocument()
  })

  it('packing filter shows Bob initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'packing')
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /orders \(1\)/i })).toBeInTheDocument()
  })

  it('advancing Bob out of packing removes him from packing filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'packing')
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(screen.getByRole('heading', { name: /orders \(0\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('Summary completion rounds correctly for 2 of 3 delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Advance Alice to delivered
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    // Advance Carol to delivered
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/completion: 67%/i)).toBeInTheDocument()
  })

  it('Summary new count is 2 after adding one more order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/customer name/i), 'Ivan')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/new: 2/i)).toBeInTheDocument()
  })

  it('filter by shipped and then All restores all orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    expect(screen.getByRole('heading', { name: /orders \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByRole('heading', { name: /orders \(3\)/i })).toBeInTheDocument()
  })

  it('theme toggle button shows current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('delivered Advance button disabled after reaching final state', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Bob: packing -> shipped -> delivered
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i })).toBeDisabled()
  })
})
