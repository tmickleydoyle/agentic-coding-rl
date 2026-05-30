import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('schedule view', () => {
  it('renders a row for every slot', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('slot-09:00')).toBeInTheDocument()
    expect(screen.getByTestId('slot-16:00')).toBeInTheDocument()
  })

  it('counts bookings per slot from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('slot-09:00-count')).toHaveTextContent('1') // Ada/Haircut
    expect(screen.getByTestId('slot-10:00-count')).toHaveTextContent('1') // Grace/Massage
    expect(screen.getByTestId('slot-11:00-count')).toHaveTextContent('0')
  })

  it('shows the booking detail inside the right slot', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-schedule'))
    const slot = screen.getByTestId('slot-09:00')
    expect(within(slot).getByText('Ada')).toBeInTheDocument()
    expect(within(slot).getByText('Haircut')).toBeInTheDocument()
  })

  it('reflects a new booking in the schedule', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-s3'))
    await user.type(screen.getByTestId('customer-input'), 'Edsger')
    await user.selectOptions(screen.getByTestId('slot-select'), '13:00')
    await user.click(screen.getByTestId('submit-booking'))
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('slot-13:00-count')).toHaveTextContent('1')
    expect(within(screen.getByTestId('slot-13:00')).getByText('Edsger')).toBeInTheDocument()
  })
})
