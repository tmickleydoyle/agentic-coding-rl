import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Venue Booking System', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /venue booking system/i })).toBeInTheDocument()
  })

  it('shows total bookings count', () => {
    render(<App />)
    expect(screen.getByTestId('total-bookings')).toHaveTextContent('Total Bookings: 3')
  })

  it('shows total revenue from seed bookings', () => {
    render(<App />)
    // bookings: Grand Hall $2000, Garden Terrace $800, Grand Hall $2000 = $4800
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('Total Revenue: $4800')
  })

  it('shows all venues by default', () => {
    render(<App />)
    expect(screen.getByTestId('venue-1')).toBeInTheDocument()
    expect(screen.getByTestId('venue-2')).toBeInTheDocument()
    expect(screen.getByTestId('venue-3')).toBeInTheDocument()
    expect(screen.getByTestId('venue-4')).toBeInTheDocument()
  })

  it('shows venue details', () => {
    render(<App />)
    expect(screen.getByTestId('capacity-1')).toHaveTextContent('Capacity: 500')
    expect(screen.getByTestId('price-1')).toHaveTextContent('Price: $2000/day')
    expect(screen.getByTestId('type-1')).toHaveTextContent('conference')
  })

  it('filters venues by type', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by type/i), 'meeting')
    expect(screen.getByTestId('venue-3')).toBeInTheDocument()
    expect(screen.queryByTestId('venue-1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('venue-2')).not.toBeInTheDocument()
  })

  it('books a venue successfully', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/select venue/i), 'Boardroom A')
    await user.type(screen.getByLabelText(/^date$/i), '2025-10-01')
    await user.type(screen.getByLabelText(/organizer/i), 'Test Org')
    await user.type(screen.getByLabelText(/guest count/i), '10')
    await user.click(screen.getByRole('button', { name: /book venue/i }))
    expect(screen.getByTestId('total-bookings')).toHaveTextContent('Total Bookings: 4')
  })

  it('shows error when venue already booked on date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/select venue/i), 'Grand Hall')
    await user.type(screen.getByLabelText(/^date$/i), '2025-09-20')
    await user.type(screen.getByLabelText(/organizer/i), 'New Org')
    await user.type(screen.getByLabelText(/guest count/i), '100')
    await user.click(screen.getByRole('button', { name: /book venue/i }))
    expect(screen.getByTestId('booking-error')).toHaveTextContent('Venue already booked on that date')
  })

  it('does not book when guest count exceeds capacity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/select venue/i), 'Boardroom A')
    await user.type(screen.getByLabelText(/^date$/i), '2025-10-05')
    await user.type(screen.getByLabelText(/organizer/i), 'Big Group')
    await user.type(screen.getByLabelText(/guest count/i), '50')
    await user.click(screen.getByRole('button', { name: /book venue/i }))
    expect(screen.getByTestId('total-bookings')).toHaveTextContent('Total Bookings: 3')
  })

  it('clears form after successful booking', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/select venue/i), 'Rooftop Lounge')
    await user.type(screen.getByLabelText(/^date$/i), '2025-10-10')
    await user.type(screen.getByLabelText(/organizer/i), 'Party Co')
    await user.type(screen.getByLabelText(/guest count/i), '80')
    await user.click(screen.getByRole('button', { name: /book venue/i }))
    expect(screen.getByLabelText(/organizer/i)).toHaveValue('')
    expect(screen.getByLabelText(/^date$/i)).toHaveValue('')
  })

  it('cancels a booking', async () => {
    const user = userEvent.setup()
    render(<App />)
    const booking1 = screen.getByTestId('booking-1')
    await user.click(within(booking1).getByRole('button', { name: /cancel/i }))
    expect(screen.queryByTestId('booking-1')).not.toBeInTheDocument()
    expect(screen.getByTestId('total-bookings')).toHaveTextContent('Total Bookings: 2')
  })

  it('updates revenue after cancellation', async () => {
    const user = userEvent.setup()
    render(<App />)
    const booking2 = screen.getByTestId('booking-2')
    await user.click(within(booking2).getByRole('button', { name: /cancel/i }))
    // Remove Garden Terrace $800 => $4800 - $800 = $4000
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('Total Revenue: $4000')
  })

  it('shows booking cost for each booking', () => {
    render(<App />)
    expect(screen.getByTestId('booking-cost-1')).toHaveTextContent('$2000')
    expect(screen.getByTestId('booking-cost-2')).toHaveTextContent('$800')
  })
})
