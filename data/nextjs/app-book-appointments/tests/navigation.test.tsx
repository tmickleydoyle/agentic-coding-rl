import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the services page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-services')).toBeInTheDocument()
    expect(screen.getByTestId('nav-services')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-book')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the schedule page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('page-schedule')).toBeInTheDocument()
    expect(screen.getByTestId('nav-schedule')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-services')).not.toHaveAttribute('aria-current')
  })

  it('navigates to my bookings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-bookings'))
    expect(screen.getByTestId('page-my-bookings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-my-bookings')).toHaveAttribute('aria-current', 'page')
  })

  it('shows the no-service hint when visiting book directly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-book'))
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
    expect(screen.getByTestId('no-service')).toBeInTheDocument()
  })
})
