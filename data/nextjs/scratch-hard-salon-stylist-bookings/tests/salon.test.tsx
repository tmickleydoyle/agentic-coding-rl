import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function book(u: U, client: string, stylist: string, service: string) {
  await u.clear(screen.getByLabelText(/client/i))
  if (client) await u.type(screen.getByLabelText(/client/i), client)
  await u.selectOptions(screen.getByLabelText(/stylist/i), stylist)
  await u.selectOptions(screen.getByLabelText(/service/i), service)
  await u.click(screen.getByRole('button', { name: /book appointment/i }))
}
const stylistsView = () => screen.getByRole('region', { name: 'Stylists view' })

describe('Salon booking app', () => {
  it('starts on Appointments', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stylists')
    expect(screen.getByRole('heading', { name: 'Stylists' })).toBeInTheDocument()
    await nav(u, 'Reports')
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Appointments')
    expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
  })

  it('books an appointment with the service price and booked status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Dana', 'Ava', 'Color')
    expect(screen.getByText('Dana with Ava: Color ($90) — booked')).toBeInTheDocument()
  })

  it('uses the correct price for each service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Cara', 'Mia', 'Blowout')
    expect(screen.getByText('Cara with Mia: Blowout ($35) — booked')).toBeInTheDocument()
  })

  it('ignores a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, '', 'Ava', 'Haircut')
    await nav(u, 'Reports')
    expect(screen.getByText(/total appointments: 0/i)).toBeInTheDocument()
  })

  it('completing an appointment updates its status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Dana', 'Ava', 'Haircut')
    await u.click(screen.getByRole('button', { name: 'Complete Dana' }))
    expect(screen.getByText('Dana with Ava: Haircut ($40) — completed')).toBeInTheDocument()
  })

  it('cancelling an appointment updates its status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Eve', 'Leo', 'Color')
    await u.click(screen.getByRole('button', { name: 'Cancel Eve' }))
    expect(screen.getByText('Eve with Leo: Color ($90) — cancelled')).toBeInTheDocument()
  })

  it('hides Complete and Cancel controls once an appointment is completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Dana', 'Ava', 'Haircut')
    await u.click(screen.getByRole('button', { name: 'Complete Dana' }))
    expect(screen.queryByRole('button', { name: 'Complete Dana' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel Dana' })).not.toBeInTheDocument()
  })

  it('counts non-cancelled bookings per stylist (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', 'Haircut')
    await book(u, 'B', 'Ava', 'Color')
    await book(u, 'C', 'Mia', 'Blowout')
    await nav(u, 'Stylists')
    expect(within(stylistsView()).getByText(/ava: 2 bookings, \$0 earned/i)).toBeInTheDocument()
    expect(within(stylistsView()).getByText(/mia: 1 bookings, \$0 earned/i)).toBeInTheDocument()
    expect(within(stylistsView()).getByText(/leo: 0 bookings, \$0 earned/i)).toBeInTheDocument()
  })

  it('only completed appointments count toward stylist earnings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', 'Color')
    await book(u, 'B', 'Ava', 'Haircut')
    await u.click(screen.getByRole('button', { name: 'Complete A' }))
    await nav(u, 'Stylists')
    expect(within(stylistsView()).getByText(/ava: 2 bookings, \$90 earned/i)).toBeInTheDocument()
  })

  it('a cancelled appointment does not count as a booking', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Leo', 'Haircut')
    await book(u, 'B', 'Leo', 'Color')
    await u.click(screen.getByRole('button', { name: 'Cancel A' }))
    await nav(u, 'Stylists')
    expect(within(stylistsView()).getByText(/leo: 1 bookings, \$0 earned/i)).toBeInTheDocument()
  })

  it('sums earnings across multiple completed appointments for a stylist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Mia', 'Color')
    await book(u, 'B', 'Mia', 'Haircut')
    await u.click(screen.getByRole('button', { name: 'Complete A' }))
    await u.click(screen.getByRole('button', { name: 'Complete B' }))
    await nav(u, 'Stylists')
    expect(within(stylistsView()).getByText(/mia: 2 bookings, \$130 earned/i)).toBeInTheDocument()
  })

  it('reports total, completed and cancelled counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', 'Haircut')
    await book(u, 'B', 'Mia', 'Color')
    await book(u, 'C', 'Leo', 'Blowout')
    await u.click(screen.getByRole('button', { name: 'Complete A' }))
    await u.click(screen.getByRole('button', { name: 'Cancel B' }))
    await nav(u, 'Reports')
    expect(screen.getByText(/total appointments: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/completed: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/cancelled: 1/i)).toBeInTheDocument()
  })

  it('reports total revenue from completed appointments only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', 'Color')
    await book(u, 'B', 'Mia', 'Haircut')
    await u.click(screen.getByRole('button', { name: 'Complete A' }))
    await nav(u, 'Reports')
    expect(screen.getByText(/total revenue: \$90/i)).toBeInTheDocument()
  })

  it('computes cancellation rate as a whole-number percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', 'Haircut')
    await book(u, 'B', 'Mia', 'Color')
    await book(u, 'C', 'Leo', 'Blowout')
    await book(u, 'D', 'Ava', 'Haircut')
    await u.click(screen.getByRole('button', { name: 'Cancel A' }))
    await nav(u, 'Reports')
    expect(screen.getByText(/cancellation rate: 25%/i)).toBeInTheDocument()
  })

  it('cancellation rate is 0% with no appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Reports')
    expect(screen.getByText(/cancellation rate: 0%/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reports')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides cancelled rows when Hide cancelled is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Keep', 'Ava', 'Haircut')
    await book(u, 'Gone', 'Mia', 'Color')
    await u.click(screen.getByRole('button', { name: 'Cancel Gone' }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide cancelled/i))
    await nav(u, 'Appointments')
    expect(screen.queryByText('Gone with Mia: Color ($90) — cancelled')).not.toBeInTheDocument()
    expect(screen.getByText('Keep with Ava: Haircut ($40) — booked')).toBeInTheDocument()
  })

  it('hidden cancelled appointments still count in Reports', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Gone', 'Mia', 'Color')
    await u.click(screen.getByRole('button', { name: 'Cancel Gone' }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide cancelled/i))
    await nav(u, 'Reports')
    expect(screen.getByText(/cancelled: 1/i)).toBeInTheDocument()
  })
})
