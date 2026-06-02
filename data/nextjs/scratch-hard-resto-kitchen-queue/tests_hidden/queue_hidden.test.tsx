// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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
const board = () => screen.getByRole('region', { name: 'Board view' })
const stats = () => screen.getByRole('region', { name: 'Stats view' })
async function advanceRow(u: U, n: number) {
  const btns = within(board()).getAllByRole('button', { name: /advance/i })
  await u.click(btns[n])
}

describe('Kitchen queue (held-out)', () => {
  it('keeps the active table as the lowest still-open even after others served', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '2', 'A')
    await send(u, '5', 'B')
    await nav(u, 'Board')
    // serve ticket at table 2 (row 0)
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    await nav(u, 'Stats')
    expect(within(stats()).getByText('Active table: 5')).toBeInTheDocument()
  })

  it('a served ticket still counts in its stage total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '1', 'A')
    await nav(u, 'Board')
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    await nav(u, 'Stats')
    expect(within(stats()).getByText('Served: 1')).toBeInTheDocument()
    expect(within(stats()).getByText('Queued: 0')).toBeInTheDocument()
  })

  it('does not advance past Served', async () => {
    const u = userEvent.setup()
    render(<App />)
    await send(u, '1', 'A')
    await nav(u, 'Board')
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    await advanceRow(u, 0)
    // no button remains; rendered stage stays Served
    expect(within(board()).getByText('#1 Table 1 - A [Served]')).toBeInTheDocument()
  })
})
