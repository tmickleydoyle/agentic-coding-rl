// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addOrder(u: U, name: string) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), name)
  await u.click(screen.getByRole('button', { name: /add order/i }))
}

function orderRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

describe('Order Tracker (held-out)', () => {
  it('starts with Delivery rate: 0% in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Delivery rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total orders: 0')).toBeInTheDocument()
  })

  it('all four status counts appear as zero initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('Packing: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
  })

  it('advancing to shipped reflects in Summary Shipped count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Petra')
    await u.click(within(orderRow('Petra')).getByRole('button', { name: /advance petra/i }))
    await u.click(within(orderRow('Petra')).getByRole('button', { name: /advance petra/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
  })

  it('delivery rate rounds correctly for 1 of 3 delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Q1')
    await addOrder(u, 'Q2')
    await addOrder(u, 'Q3')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Q1')).getByRole('button', { name: /advance q1/i }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Delivery rate: 33%')).toBeInTheDocument()
  })

  it('filter by new shows only new orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Ray')
    await addOrder(u, 'Sara')
    await u.click(within(orderRow('Ray')).getByRole('button', { name: /advance ray/i }))
    const select = screen.getByLabelText(/filter by status/i)
    await u.selectOptions(select, 'new')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Sara')).toBeInTheDocument()
    expect(screen.queryByText('Ray')).not.toBeInTheDocument()
  })

  it('filter by shipped works end-to-end', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Tom')
    await addOrder(u, 'Uma')
    for (let i = 0; i < 2; i++) {
      await u.click(within(orderRow('Tom')).getByRole('button', { name: /advance tom/i }))
    }
    const select = screen.getByLabelText(/filter by status/i)
    await u.selectOptions(select, 'shipped')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Tom')).toBeInTheDocument()
    expect(screen.queryByText('Uma')).not.toBeInTheDocument()
  })

  it('filter persists state while adding more orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Vera')
    const select = screen.getByLabelText(/filter by status/i)
    await u.selectOptions(select, 'new')
    await addOrder(u, 'Walt')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
  })

  it('multiple orders delivered drives delivery rate to 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Xena')
    await addOrder(u, 'Yuri')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Xena')).getByRole('button', { name: /advance xena/i }))
      await u.click(within(orderRow('Yuri')).getByRole('button', { name: /advance yuri/i }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Delivery rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
  })

  it('Summary Delivered count updates as orders advance cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Zoe')
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    await nav(u, 'Orders')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Zoe')).getByRole('button', { name: /advance zoe/i }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivery rate: 100%')).toBeInTheDocument()
  })
})
