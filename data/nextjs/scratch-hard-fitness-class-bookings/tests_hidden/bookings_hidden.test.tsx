// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const roster = () => screen.getByRole('region', { name: 'Roster view' })

async function addClass(u: U, name: string, capacity: string) {
  await u.clear(screen.getByLabelText(/class name/i))
  await u.type(screen.getByLabelText(/class name/i), name)
  await u.clear(screen.getByLabelText(/capacity/i))
  await u.type(screen.getByLabelText(/capacity/i), capacity)
  await u.click(screen.getByRole('button', { name: /add class/i }))
}
async function book(u: U, className: string, member: string) {
  await u.selectOptions(screen.getByLabelText(/^class$/i), className)
  await u.clear(screen.getByLabelText(/member name/i))
  await u.type(screen.getByLabelText(/member name/i), member)
  await u.click(screen.getByRole('button', { name: /book spot/i }))
}

describe('Fitness class booking (held-out)', () => {
  it('promotes only the earliest waitlisted member, leaving later ones waitlisted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '1')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Yoga', 'Bob')
    await book(u, 'Yoga', 'Carol')
    await u.click(screen.getByRole('button', { name: 'Cancel Alice' }))
    expect(screen.getByText('Bob - Yoga')).toBeInTheDocument()
    expect(screen.getByText('Carol - Yoga (waitlisted)')).toBeInTheDocument()
  })

  it('reflects a promotion in the roster waitlist count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '2')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Yoga', 'Bob')
    await book(u, 'Yoga', 'Carol')
    await nav(u, 'Roster')
    expect(within(roster()).getByText(/yoga: 2\/2 booked/i)).toBeInTheDocument()
    expect(within(roster()).getByText(/yoga waitlist: 1/i)).toBeInTheDocument()
    await nav(u, 'Bookings')
    await u.click(screen.getByRole('button', { name: 'Cancel Alice' }))
    await nav(u, 'Roster')
    expect(within(roster()).getByText(/yoga: 2\/2 booked/i)).toBeInTheDocument()
    expect(within(roster()).queryByText(/yoga waitlist/i)).not.toBeInTheDocument()
  })

  it('does not mark a class FULL while it has spare confirmed capacity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Pilates', '4')
    await nav(u, 'Bookings')
    await book(u, 'Pilates', 'Alice')
    await nav(u, 'Roster')
    expect(within(roster()).getByText(/pilates: 1\/4 booked/i)).toBeInTheDocument()
    expect(within(roster()).queryByText(/pilates full/i)).not.toBeInTheDocument()
  })

  it('unchecking Hide full classes brings full classes back to the roster', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '1')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide full classes/i))
    await u.click(screen.getByLabelText(/hide full classes/i))
    await nav(u, 'Roster')
    expect(within(roster()).getByText(/yoga: 1\/1 booked/i)).toBeInTheDocument()
  })
})
