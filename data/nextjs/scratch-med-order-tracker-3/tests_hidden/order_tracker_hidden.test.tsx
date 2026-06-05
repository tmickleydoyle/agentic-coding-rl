// Held-out generalization tests — different inputs and sequences
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
  it('Summary Completion: 100% when all orders are delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Tom')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Tom')).getByRole('button', { name: /advance tom/i }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
  })

  it('Summary Completion rounds correctly for one of three delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Una')
    await addOrder(u, 'Vic')
    await addOrder(u, 'Wes')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Una')).getByRole('button', { name: /advance una/i }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('filter by shipped shows only shipped orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Xena')
    await addOrder(u, 'Yara')
    await u.click(within(orderRow('Xena')).getByRole('button', { name: /advance xena/i }))
    await u.click(within(orderRow('Xena')).getByRole('button', { name: /advance xena/i }))
    await u.click(screen.getByRole('button', { name: 'shipped' }))
    expect(screen.getByText('Showing: 1 order(s)')).toBeInTheDocument()
    expect(screen.getByText('Xena')).toBeInTheDocument()
    expect(screen.queryByText('Yara')).not.toBeInTheDocument()
  })

  it('advancing a filtered-out order removes it from view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Zach')
    await u.click(screen.getByRole('button', { name: 'new' }))
    expect(screen.getByText('Showing: 1 order(s)')).toBeInTheDocument()
    await u.click(within(orderRow('Zach')).getByRole('button', { name: /advance zach/i }))
    expect(screen.getByText('Showing: 0 order(s)')).toBeInTheDocument()
    expect(screen.queryByText('Zach')).not.toBeInTheDocument()
  })

  it('filter by delivered hides new and packing orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Amy')
    await addOrder(u, 'Ben')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Amy')).getByRole('button', { name: /advance amy/i }))
    }
    await u.click(within(orderRow('Ben')).getByRole('button', { name: /advance ben/i }))
    await u.click(screen.getByRole('button', { name: 'delivered' }))
    expect(screen.getByText('Showing: 1 order(s)')).toBeInTheDocument()
    expect(screen.getByText('Amy')).toBeInTheDocument()
    expect(screen.queryByText('Ben')).not.toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Summary New count reflects orders not yet advanced', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Cara')
    await addOrder(u, 'Dan')
    await addOrder(u, 'Eli')
    await u.click(within(orderRow('Cara')).getByRole('button', { name: /advance cara/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('New: 2')).toBeInTheDocument()
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
  })

  it('adding multiple orders shows them all in Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Fay')
    await addOrder(u, 'Gil')
    await addOrder(u, 'Hal')
    expect(screen.getByText('Showing: 3 order(s)')).toBeInTheDocument()
  })

  it('order state is preserved when navigating Orders -> Settings -> Orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Ivy')
    await u.click(within(orderRow('Ivy')).getByRole('button', { name: /advance ivy/i }))
    await nav(u, 'Settings')
    await nav(u, 'Orders')
    expect(within(orderRow('Ivy')).getByText('packing')).toBeInTheDocument()
  })
})
