import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('booking flow', () => {
  it('lists seeded rooms with floors', () => {
    render(<App />)
    expect(screen.getByTestId('room-m1-name')).toHaveTextContent('Aspen')
    expect(screen.getByTestId('room-m1-floor')).toHaveTextContent('1')
    expect(screen.getByTestId('room-m3-floor')).toHaveTextContent('3')
  })

  it('selecting a room navigates to book and shows its name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-m1'))
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
    expect(screen.getByTestId('selected-room')).toHaveTextContent('Aspen')
  })

  it('blocks booking with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-m1'))
    await user.click(screen.getByTestId('submit-booking'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
  })

  it('books a non-conflicting slot and shows it in my bookings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-m1'))
    await user.type(screen.getByTestId('title-input'), 'Planning')
    await user.clear(screen.getByTestId('start-input'))
    await user.type(screen.getByTestId('start-input'), '11')
    await user.clear(screen.getByTestId('end-input'))
    await user.type(screen.getByTestId('end-input'), '12')
    await user.click(screen.getByTestId('submit-booking'))
    expect(screen.getByTestId('page-my-bookings')).toBeInTheDocument()
    const list = screen.getByTestId('bookings-list')
    expect(within(list).getByText('Planning')).toBeInTheDocument()
  })

  it('rejects an overlapping booking on the same room', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-m1')) // m1 has 9-10 Standup
    await user.type(screen.getByTestId('title-input'), 'Clash')
    await user.clear(screen.getByTestId('start-input'))
    await user.type(screen.getByTestId('start-input'), '9')
    await user.clear(screen.getByTestId('end-input'))
    await user.type(screen.getByTestId('end-input'), '10')
    await user.click(screen.getByTestId('submit-booking'))
    expect(screen.getByTestId('conflict-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
  })

  it('allows a touching (non-overlapping) booking', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-m1')) // m1 has 9-10
    await user.type(screen.getByTestId('title-input'), 'Right after')
    await user.clear(screen.getByTestId('start-input'))
    await user.type(screen.getByTestId('start-input'), '10')
    await user.clear(screen.getByTestId('end-input'))
    await user.type(screen.getByTestId('end-input'), '11')
    await user.click(screen.getByTestId('submit-booking'))
    expect(screen.getByTestId('page-my-bookings')).toBeInTheDocument()
  })

  it('rejects a booking where start is not before end', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-m3'))
    await user.type(screen.getByTestId('title-input'), 'Backwards')
    await user.clear(screen.getByTestId('start-input'))
    await user.type(screen.getByTestId('start-input'), '14')
    await user.clear(screen.getByTestId('end-input'))
    await user.type(screen.getByTestId('end-input'), '12')
    await user.click(screen.getByTestId('submit-booking'))
    expect(screen.getByTestId('conflict-error')).toBeInTheDocument()
  })

  it('cancels a booking', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-bookings'))
    expect(screen.getByTestId('booking-k1')).toBeInTheDocument()
    await user.click(screen.getByTestId('cancel-k1'))
    expect(screen.queryByTestId('booking-k1')).not.toBeInTheDocument()
  })

  it('shows an empty state when all bookings are cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-bookings'))
    await user.click(screen.getByTestId('cancel-k1'))
    await user.click(screen.getByTestId('cancel-k2'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('bookings-list')).not.toBeInTheDocument()
  })
})
