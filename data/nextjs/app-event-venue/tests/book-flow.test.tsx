import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('book flow', () => {
  it('shows no-venue on book without a selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-book'))
    expect(screen.getByTestId('no-venue')).toBeInTheDocument()
  })

  it('blocks booking with a blank organizer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('book-btn'))
    await user.click(screen.getByTestId('submit-book'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
  })

  it('books a venue on a free date and shows it in bookings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('book-btn'))
    await user.type(screen.getByTestId('organizer-input'), 'Linus')
    await user.selectOptions(screen.getByTestId('date-select'), '2026-06-03')
    await user.clear(screen.getByTestId('attendees-input'))
    await user.type(screen.getByTestId('attendees-input'), '100')
    await user.click(screen.getByTestId('submit-book'))
    expect(screen.getByTestId('page-bookings')).toBeInTheDocument()
    const list = screen.getByTestId('bookings-list')
    expect(within(list).getByText('Linus')).toBeInTheDocument()
  })

  it('rejects booking over the venue capacity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g2')) // capacity 40
    await user.click(screen.getByTestId('book-btn'))
    await user.type(screen.getByTestId('organizer-input'), 'Big')
    await user.selectOptions(screen.getByTestId('date-select'), '2026-06-03')
    await user.clear(screen.getByTestId('attendees-input'))
    await user.type(screen.getByTestId('attendees-input'), '100')
    await user.click(screen.getByTestId('submit-book'))
    expect(screen.getByTestId('book-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
  })

  it('rejects booking on an already-taken date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('book-btn'))
    await user.type(screen.getByTestId('organizer-input'), 'Clash')
    await user.selectOptions(screen.getByTestId('date-select'), '2026-06-01') // g1 taken
    await user.clear(screen.getByTestId('attendees-input'))
    await user.type(screen.getByTestId('attendees-input'), '10')
    await user.click(screen.getByTestId('submit-book'))
    expect(screen.getByTestId('book-error')).toBeInTheDocument()
  })

  it('marks the date booked on the venues page after booking', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('book-btn'))
    await user.type(screen.getByTestId('organizer-input'), 'Edsger')
    await user.selectOptions(screen.getByTestId('date-select'), '2026-06-03')
    await user.clear(screen.getByTestId('attendees-input'))
    await user.type(screen.getByTestId('attendees-input'), '50')
    await user.click(screen.getByTestId('submit-book'))
    await user.click(screen.getByTestId('nav-venues'))
    await user.selectOptions(screen.getByTestId('date-select'), '2026-06-03')
    expect(screen.getByTestId('venue-g1-status')).toHaveTextContent('booked')
  })
})

describe('bookings view', () => {
  it('lists the seeded bookings with totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-bookings'))
    expect(screen.getByTestId('booking-b1-venue')).toHaveTextContent('Grand Hall')
    expect(screen.getByTestId('booking-b1-attendees')).toHaveTextContent('150')
    // 150 + 30 = 180
    expect(screen.getByTestId('total-attendees')).toHaveTextContent('180')
  })

  it('cancels a booking', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-bookings'))
    await user.click(screen.getByTestId('cancel-b1'))
    expect(screen.queryByTestId('booking-b1')).not.toBeInTheDocument()
    expect(screen.getByTestId('total-attendees')).toHaveTextContent('30')
  })

  it('shows an empty state when all bookings are cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-bookings'))
    await user.click(screen.getByTestId('cancel-b1'))
    await user.click(screen.getByTestId('cancel-b2'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('bookings-list')).not.toBeInTheDocument()
  })
})
