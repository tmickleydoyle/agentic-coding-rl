import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('venues view', () => {
  it('lists venues with capacities', () => {
    render(<App />)
    expect(screen.getByTestId('venue-g1-name')).toHaveTextContent('Grand Hall')
    expect(screen.getByTestId('venue-g1-capacity')).toHaveTextContent('200')
    expect(screen.getByTestId('venue-g2-name')).toHaveTextContent('Studio B')
  })

  it('marks a venue booked on its taken date', () => {
    render(<App />)
    // default date 2026-06-01: g1 is booked (b1), g2 is available
    expect(screen.getByTestId('venue-g1-status')).toHaveTextContent('booked')
    expect(screen.getByTestId('venue-g2-status')).toHaveTextContent('available')
  })

  it('updates availability when the date changes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('date-select'), '2026-06-02')
    // 2026-06-02: g2 is booked (b2), g1 available
    expect(screen.getByTestId('venue-g1-status')).toHaveTextContent('available')
    expect(screen.getByTestId('venue-g2-status')).toHaveTextContent('booked')
  })

  it('shows a venue available on a free date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('date-select'), '2026-06-03')
    expect(screen.getByTestId('venue-g1-status')).toHaveTextContent('available')
    expect(screen.getByTestId('venue-g2-status')).toHaveTextContent('available')
  })

  it('selecting a venue opens its detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    expect(screen.getByTestId('page-venue-detail')).toBeInTheDocument()
    expect(screen.getByTestId('venue-name')).toHaveTextContent('Grand Hall')
  })
})
