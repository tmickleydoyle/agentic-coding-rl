import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders rooms by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-rooms')).toBeInTheDocument()
    expect(screen.getByTestId('nav-rooms')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-book')).not.toHaveAttribute('aria-current')
  })

  it('navigates to schedule', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('page-schedule')).toBeInTheDocument()
    expect(screen.getByTestId('nav-schedule')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to my bookings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-bookings'))
    expect(screen.getByTestId('page-my-bookings')).toBeInTheDocument()
  })

  it('shows no-room hint when visiting book directly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-book'))
    expect(screen.getByTestId('no-room')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
