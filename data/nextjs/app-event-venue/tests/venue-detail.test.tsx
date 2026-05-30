import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('venue detail view', () => {
  it('shows no-venue when none is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-venue-detail'))
    expect(screen.getByTestId('no-venue')).toBeInTheDocument()
  })

  it('lists the venue bookings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    expect(screen.getByTestId('vb-b1-date')).toHaveTextContent('2026-06-01')
    expect(screen.getByTestId('vb-b1-attendees')).toHaveTextContent('150')
  })

  it('navigates to the booking form from a venue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g2'))
    await user.click(screen.getByTestId('book-btn'))
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
  })
})
