import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('schedule view', () => {
  it('renders a schedule group per room', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('room-schedule-m1')).toBeInTheDocument()
    expect(screen.getByTestId('room-schedule-m2')).toBeInTheDocument()
    expect(screen.getByTestId('room-schedule-m3')).toBeInTheDocument()
  })

  it('counts bookings per room from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('room-schedule-m1-count')).toHaveTextContent('1')
    expect(screen.getByTestId('room-schedule-m2-count')).toHaveTextContent('1')
    expect(screen.getByTestId('room-schedule-m3-count')).toHaveTextContent('0')
  })

  it('shows the booking title within its room group', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-schedule'))
    const group = screen.getByTestId('room-schedule-m1')
    expect(within(group).getByText('Standup')).toBeInTheDocument()
  })

  it('reflects a new booking in the schedule count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-m3'))
    await user.type(screen.getByTestId('title-input'), 'Sync')
    await user.clear(screen.getByTestId('start-input'))
    await user.type(screen.getByTestId('start-input'), '15')
    await user.clear(screen.getByTestId('end-input'))
    await user.type(screen.getByTestId('end-input'), '16')
    await user.click(screen.getByTestId('submit-booking'))
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('room-schedule-m3-count')).toHaveTextContent('1')
  })
})
