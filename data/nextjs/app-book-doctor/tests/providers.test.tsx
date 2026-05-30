import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('providers list', () => {
  it('lists providers with specialties', () => {
    render(<App />)
    expect(screen.getByTestId('provider-p1-name')).toHaveTextContent('Dr. Ada Lovelace')
    expect(screen.getByTestId('provider-p1-specialty')).toHaveTextContent('Cardiology')
    expect(screen.getByTestId('provider-p3-specialty')).toHaveTextContent('Neurology')
  })

  it('shows the number of open (unbooked) slots per provider', () => {
    render(<App />)
    // p1 has 2 slots, 1 booked => 1 open; p2 has 2 slots, 1 booked => 1 open; p3 1 open
    expect(screen.getByTestId('provider-p1-open')).toHaveTextContent('1')
    expect(screen.getByTestId('provider-p2-open')).toHaveTextContent('1')
    expect(screen.getByTestId('provider-p3-open')).toHaveTextContent('1')
  })

  it('selecting a provider navigates to book', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-p1'))
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
    expect(screen.getByTestId('selected-provider')).toHaveTextContent('Dr. Ada Lovelace')
  })
})
