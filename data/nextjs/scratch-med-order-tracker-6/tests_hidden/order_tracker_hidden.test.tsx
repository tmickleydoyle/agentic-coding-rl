// HELD-OUT generalization tests — fresh scenarios not seen during training.
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
  it('advancing to shipped then filtering by shipped shows only that order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Speedy')
    await addOrder(u, 'Slow')
    await u.click(within(orderRow('Speedy')).getByRole('button', { name: /advance speedy/i }))
    await u.click(within(orderRow('Speedy')).getByRole('button', { name: /advance speedy/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Speedy')).toBeInTheDocument()
    expect(screen.queryByText('Slow')).not.toBeInTheDocument()
  })

  it('Summary fulfillment rate rounds correctly for one-third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'A')
    await addOrder(u, 'B')
    await addOrder(u, 'C')
    // deliver A only
    await u.click(within(orderRow('A')).getByRole('button', { name: /advance a/i }))
    await u.click(within(orderRow('A')).getByRole('button', { name: /advance a/i }))
    await u.click(within(orderRow('A')).getByRole('button', { name: /advance a/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Fulfillment rate: 33%')).toBeInTheDocument()
  })

  it('multiple orders delivered gives 100% fulfillment rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    const names = ['D1', 'D2']
    for (const n of names) {
      await addOrder(u, n)
    }
    for (const n of names) {
      for (let i = 0; i < 3; i++) {
        await u.click(within(orderRow(n)).getByRole('button', { name: new RegExp(`advance ${n}`, 'i') }))
      }
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Fulfillment rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
  })

  it('advance button stays disabled after multiple clicks on delivered order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Final')
    for (let i = 0; i < 5; i++) {
      const btn = within(orderRow('Final')).getByRole('button', { name: /advance final/i })
      if (!btn.hasAttribute('disabled')) await u.click(btn)
    }
    expect(within(orderRow('Final')).getByRole('button', { name: /advance final/i })).toBeDisabled()
    expect(within(orderRow('Final')).getByText('delivered')).toBeInTheDocument()
  })

  it('filter to delivered hides new orders and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Fresh')
    await addOrder(u, 'Complete')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Complete')).getByRole('button', { name: /advance complete/i }))
    }
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'delivered')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.queryByText('Fresh')).not.toBeInTheDocument()
    expect(screen.getByText('Complete')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Summary Packing count updates when order is advanced to packing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Boxer')
    await u.click(within(orderRow('Boxer')).getByRole('button', { name: /advance boxer/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
  })

  it('whitespace-only customer name is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/customer name/i), '   ')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByText('Showing: 0 orders')).toBeInTheDocument()
  })
})
