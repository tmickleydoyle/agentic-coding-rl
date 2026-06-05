// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const stylistsView = () => screen.getByRole('region', { name: 'Stylists view' })

async function book(u: U, client: string, stylist: string, service: string) {
  await u.clear(screen.getByLabelText(/client/i))
  await u.type(screen.getByLabelText(/client/i), client)
  await u.selectOptions(screen.getByLabelText(/stylist/i), stylist)
  await u.selectOptions(screen.getByLabelText(/service/i), service)
  await u.click(screen.getByRole('button', { name: /book appointment/i }))
}

describe('Salon booking (held-out)', () => {
  it('completed appointments still count as bookings for a stylist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Leo', 'Color')
    await u.click(screen.getByRole('button', { name: 'Complete A' }))
    await nav(u, 'Stylists')
    expect(within(stylistsView()).getByText(/leo: 1 bookings, \$90 earned/i)).toBeInTheDocument()
  })

  it('tracks each stylist independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', 'Haircut')
    await book(u, 'B', 'Leo', 'Color')
    await u.click(screen.getByRole('button', { name: 'Complete A' }))
    await u.click(screen.getByRole('button', { name: 'Complete B' }))
    await nav(u, 'Stylists')
    expect(within(stylistsView()).getByText(/ava: 1 bookings, \$40 earned/i)).toBeInTheDocument()
    expect(within(stylistsView()).getByText(/leo: 1 bookings, \$90 earned/i)).toBeInTheDocument()
    expect(within(stylistsView()).getByText(/mia: 0 bookings, \$0 earned/i)).toBeInTheDocument()
  })

  it('rounds cancellation rate to a whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', 'Haircut')
    await book(u, 'B', 'Mia', 'Color')
    await book(u, 'C', 'Leo', 'Blowout')
    await u.click(screen.getByRole('button', { name: 'Cancel A' }))
    await nav(u, 'Reports')
    // 1/3 = 33.33 -> 33
    expect(screen.getByText(/cancellation rate: 33%/i)).toBeInTheDocument()
  })

  it('unchecking Hide cancelled brings cancelled rows back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Gone', 'Mia', 'Color')
    await u.click(screen.getByRole('button', { name: 'Cancel Gone' }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide cancelled/i))
    await u.click(screen.getByLabelText(/hide cancelled/i))
    await nav(u, 'Appointments')
    expect(screen.getByText('Gone with Mia: Color ($90) — cancelled')).toBeInTheDocument()
  })
})
