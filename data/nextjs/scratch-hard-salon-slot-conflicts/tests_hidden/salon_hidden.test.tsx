// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const conflictsView = () => screen.getByRole('region', { name: 'Conflicts view' })

async function book(u: U, client: string, stylist: string, start: string, duration: string) {
  await u.clear(screen.getByLabelText(/client/i))
  if (client) await u.type(screen.getByLabelText(/client/i), client)
  await u.selectOptions(screen.getByLabelText(/stylist/i), stylist)
  await u.selectOptions(screen.getByLabelText(/start time/i), start)
  await u.selectOptions(screen.getByLabelText(/duration/i), duration)
  await u.click(screen.getByRole('button', { name: /book slot/i }))
}

describe('Salon scheduling (held-out)', () => {
  it('a short appointment fully inside a longer one conflicts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Long', 'Leo', '9:00', '90 min')
    await book(u, 'Short', 'Leo', '10:00', '30 min')
    expect(screen.getByText('Long with Leo: 9:00-10:30 (conflict)')).toBeInTheDocument()
    expect(screen.getByText('Short with Leo: 10:00-10:30 (conflict)')).toBeInTheDocument()
  })

  it('removing one of two conflicting appointments clears the other flag', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '90 min')
    await book(u, 'B', 'Ava', '10:00', '60 min')
    await u.click(screen.getByRole('button', { name: 'Remove A' }))
    expect(screen.getByText('B with Ava: 10:00-11:00')).toBeInTheDocument()
    await nav(u, 'Conflicts')
    expect(within(conflictsView()).getByText(/conflicting appointments: 0/i)).toBeInTheDocument()
  })

  it('separate non-overlapping pairs stay conflict-free', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '30 min')
    await book(u, 'B', 'Ava', '11:00', '30 min')
    await book(u, 'C', 'Ava', '13:00', '30 min')
    await nav(u, 'Reports')
    expect(screen.getByText(/conflict-free: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/in conflict: 0/i)).toBeInTheDocument()
  })

  it('unchecking Show conflicts only restores clean rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '90 min')
    await book(u, 'B', 'Ava', '10:00', '60 min')
    await book(u, 'Clean', 'Leo', '13:00', '30 min')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show conflicts only/i))
    await u.click(screen.getByLabelText(/show conflicts only/i))
    await nav(u, 'Schedule')
    expect(screen.getByText('Clean with Leo: 13:00-13:30')).toBeInTheDocument()
  })
})
