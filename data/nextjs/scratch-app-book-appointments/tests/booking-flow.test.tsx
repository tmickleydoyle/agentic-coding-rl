import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('booking flow', () => {
  it('lists seeded services with durations', () => {
    render(<App />)
    const list = screen.getByTestId('services-list')
    expect(within(list).getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByTestId('service-s1-duration')).toHaveTextContent('30')
    expect(screen.getByTestId('service-s2-duration')).toHaveTextContent('60')
  })

  it('selecting a service navigates to book and shows its name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-s1'))
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
    expect(screen.getByTestId('selected-service')).toHaveTextContent('Haircut')
  })

  it('only offers free slots for the selected service', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-s1'))
    // s1 already has 09:00 booked, so it should not be an option
    const select = screen.getByTestId('slot-select') as HTMLSelectElement
    const values = Array.from(select.options).map((o) => o.value)
    expect(values).not.toContain('09:00')
    expect(values).toContain('10:00')
  })

  it('blocks booking with an empty customer name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-s1'))
    await user.click(screen.getByTestId('submit-booking'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
  })

  it('books an appointment and shows it in my bookings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-s1'))
    await user.type(screen.getByTestId('customer-input'), 'Linus')
    await user.selectOptions(screen.getByTestId('slot-select'), '11:00')
    await user.click(screen.getByTestId('submit-booking'))
    expect(screen.getByTestId('page-my-bookings')).toBeInTheDocument()
    const list = screen.getByTestId('bookings-list')
    expect(within(list).getByText('Linus')).toBeInTheDocument()
    expect(within(list).getByText('11:00')).toBeInTheDocument()
  })

  it('cancels a booking', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-bookings'))
    expect(screen.getByTestId('booking-b1')).toBeInTheDocument()
    await user.click(screen.getByTestId('cancel-b1'))
    expect(screen.queryByTestId('booking-b1')).not.toBeInTheDocument()
  })

  it('shows an empty state when all bookings are cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-bookings'))
    await user.click(screen.getByTestId('cancel-b1'))
    await user.click(screen.getByTestId('cancel-b2'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('bookings-list')).not.toBeInTheDocument()
  })
})
