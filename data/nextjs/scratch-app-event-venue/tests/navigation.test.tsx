import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders venues by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-venues')).toBeInTheDocument()
    expect(screen.getByTestId('nav-venues')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-book')).not.toHaveAttribute('aria-current')
  })

  it('navigates to bookings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-bookings'))
    expect(screen.getByTestId('page-bookings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-bookings')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to book', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-book'))
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
  })

  it('navigates to venue-detail and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-venue-detail'))
    expect(screen.getByTestId('page-venue-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-venues'))
    expect(screen.getByTestId('page-venues')).toBeInTheDocument()
    expect(screen.getByTestId('nav-venue-detail')).not.toHaveAttribute('aria-current')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
