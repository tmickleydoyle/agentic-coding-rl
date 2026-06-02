import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function send(u: U, table: string, item: string) {
  await u.clear(screen.getByLabelText(/table/i))
  await u.type(screen.getByLabelText(/table/i), table)
  await u.clear(screen.getByLabelText(/item/i))
  await u.type(screen.getByLabelText(/item/i), item)
  await u.click(screen.getByRole('button', { name: /send to kitchen/i }))
}

const queue = () => screen.getByRole('region', { name: 'Queue view' })
const board = () => screen.getByRole('region', { name: 'Board view' })
const stats = () => screen.getByRole('region', { name: 'Stats view' })

// Advance the nth ticket row (0-based) on the Board.
async function advanceRow(u: U, n: number) {
  const btns = within(board()).getAllByRole('button', { name: /advance/i })
  await u.click(btns[n])
}

describe('Kitchen queue app', () => {
  it('starts on Queue', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Queue')
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
  })

  it('sends a ticket that starts Queued with number 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '4', 'Fries')
    expect(within(queue()).getByText('#1 Table 4 - Fries [Queued]')).toBeInTheDocument()
  })

  it('numbers tickets in creation order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '4', 'Fries')
    await send(u, '7', 'Soup')
    expect(within(queue()).getByText('#2 Table 7 - Soup [Queued]')).toBeInTheDocument()
  })

  it('ignores a blank item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '4', '   ')
    expect(within(queue()).queryByText(/#1/)).not.toBeInTheDocument()
  })

  it('ignores a non-positive table', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '0', 'Fries')
    expect(within(queue()).queryByText(/Fries/)).not.toBeInTheDocument()
  })

  it('ignores a fractional table', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '2.5', 'Fries')
    expect(within(queue()).queryByText(/Fries/)).not.toBeInTheDocument()
  })

  it('advances a ticket forward one stage at a time', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '4', 'Fries')
    await nav(u, 'Board')
    await advanceRow(u, 0)
    expect(within(board()).getByText('#1 Table 4 - Fries [Cooking]')).toBeInTheDocument()
    await advanceRow(u, 0)
    expect(within(board()).getByText('#1 Table 4 - Fries [Ready]')).toBeInTheDocument()
    await advanceRow(u, 0)
    expect(within(board()).getByText('#1 Table 4 - Fries [Served]')).toBeInTheDocument()
  })

  it('removes the Advance button once Served', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '4', 'Fries')
    await nav(u, 'Board')
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    expect(within(board()).queryByRole('button', { name: /advance/i })).not.toBeInTheDocument()
  })

  it('the Board change is visible back on the Queue (shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '4', 'Fries')
    await nav(u, 'Board')
    await advanceRow(u, 0)
    await nav(u, 'Queue')
    expect(within(queue()).getByText('#1 Table 4 - Fries [Cooking]')).toBeInTheDocument()
  })

  it('counts tickets per stage on Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '4', 'Fries')
    await send(u, '7', 'Soup')
    await nav(u, 'Board')
    await advanceRow(u, 0) // ticket 1 -> Cooking
    await nav(u, 'Stats')
    expect(within(stats()).getByText('Queued: 1')).toBeInTheDocument()
    expect(within(stats()).getByText('Cooking: 1')).toBeInTheDocument()
    expect(within(stats()).getByText('Ready: 0')).toBeInTheDocument()
    expect(within(stats()).getByText('Served: 0')).toBeInTheDocument()
  })

  it('counts open tickets (not served)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '4', 'Fries')
    await send(u, '7', 'Soup')
    await nav(u, 'Board')
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    await advanceRow(u, 0) // ticket 1 served
    await nav(u, 'Stats')
    expect(within(stats()).getByText('Open tickets: 1')).toBeInTheDocument()
  })

  it('names the lowest unserved table as active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '9', 'Fries')
    await send(u, '3', 'Soup')
    await nav(u, 'Stats')
    expect(within(stats()).getByText('Active table: 3')).toBeInTheDocument()
  })

  it('shows Active table: none with no tickets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(within(stats()).getByText('Active table: none')).toBeInTheDocument()
  })

  it('shows Active table: none once all are served', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '4', 'Fries')
    await nav(u, 'Board')
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    await nav(u, 'Stats')
    expect(within(stats()).getByText('Active table: none')).toBeInTheDocument()
    expect(within(stats()).getByText('Open tickets: 0')).toBeInTheDocument()
  })

  it('starts with no tickets and an empty board', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})
