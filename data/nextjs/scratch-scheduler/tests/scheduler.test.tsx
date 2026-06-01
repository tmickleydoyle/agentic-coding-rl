import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

function bookingList(): HTMLElement {
  return screen.getByRole('region', { name: 'Bookings' })
}
async function book(u: U, title: string, start: string, duration: string) {
  await u.clear(screen.getByLabelText(/title/i))
  await u.type(screen.getByLabelText(/title/i), title)
  await u.selectOptions(screen.getByLabelText(/start time/i), start)
  await u.selectOptions(screen.getByLabelText(/duration/i), duration)
  await u.click(screen.getByRole('button', { name: /^book$/i }))
}

describe('Day scheduler', () => {
  it('starts with all 16 slots free and no bookings', () => {
    render(<App />)
    expect(screen.getByText(/free slots: 16/i)).toBeInTheDocument()
    expect(within(bookingList()).queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('books an appointment and consumes slots', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Standup', '09:00', '60')
    expect(within(bookingList()).getByText(/standup 09:00 - 10:00/i)).toBeInTheDocument()
    expect(screen.getByText(/free slots: 14/i)).toBeInTheDocument()
  })

  it('rejects an overlapping booking', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Standup', '09:00', '60')
    await book(u, 'Sync', '09:30', '30')
    expect(screen.getByRole('alert')).toHaveTextContent(/overlaps an existing booking/i)
    expect(within(bookingList()).queryByText(/sync/i)).not.toBeInTheDocument()
    expect(screen.getByText(/free slots: 14/i)).toBeInTheDocument()
  })

  it('allows an adjacent, non-overlapping booking', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Standup', '09:00', '60')
    await book(u, 'Review', '10:00', '30')
    expect(within(bookingList()).getByText(/review 10:00 - 10:30/i)).toBeInTheDocument()
    expect(screen.getByText(/free slots: 13/i)).toBeInTheDocument()
  })

  it('rejects a booking that runs past closing time', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Long meeting', '16:30', '60')
    expect(screen.getByRole('alert')).toHaveTextContent(/past closing time/i)
    expect(within(bookingList()).queryByText(/long meeting/i)).not.toBeInTheDocument()
    expect(screen.getByText(/free slots: 16/i)).toBeInTheDocument()
  })

  it('rejects a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/start time/i), '09:00')
    await u.selectOptions(screen.getByLabelText(/duration/i), '30')
    await u.click(screen.getByRole('button', { name: /^book$/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/title is required/i)
    expect(screen.getByText(/free slots: 16/i)).toBeInTheDocument()
  })

  it('cancels a booking and frees its slots', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Standup', '09:00', '60')
    expect(screen.getByText(/free slots: 14/i)).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /cancel standup/i }))
    expect(within(bookingList()).queryByText(/standup/i)).not.toBeInTheDocument()
    expect(screen.getByText(/free slots: 16/i)).toBeInTheDocument()
  })

  it('lists bookings sorted by start time', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Late', '11:00', '30')
    await book(u, 'Early', '09:00', '30')
    const items = within(bookingList()).getAllByRole('listitem')
    expect(items[0]).toHaveTextContent(/early 09:00 - 09:30/i)
    expect(items[1]).toHaveTextContent(/late 11:00 - 11:30/i)
  })

  it('allows reusing a slot after the conflicting booking is cancelled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Standup', '09:00', '60')
    await book(u, 'Sync', '09:30', '30') // rejected
    await u.click(screen.getByRole('button', { name: /cancel standup/i }))
    await book(u, 'Sync', '09:30', '30') // now fits
    expect(within(bookingList()).getByText(/sync 09:30 - 10:00/i)).toBeInTheDocument()
    expect(screen.getByText(/free slots: 15/i)).toBeInTheDocument()
  })
})
