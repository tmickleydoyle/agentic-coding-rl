import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('dashboard stats', () => {
  it('shows total, people, and expense counts from seed data', () => {
    render(<App />)
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('180')
    expect(screen.getByTestId('stat-people-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-expenses-value')).toHaveTextContent('3')
  })

  it('shows the per-person share', () => {
    render(<App />)
    // 180 / 3 = 60
    expect(screen.getByTestId('stat-perhead-value')).toHaveTextContent('60')
  })

  it('updates the total after adding an expense', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-expenses'))
    await user.type(screen.getByTestId('description-input'), 'Drinks')
    await user.type(screen.getByTestId('amount-input'), '30')
    await user.click(screen.getByTestId('submit-expense'))
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('210')
    expect(screen.getByTestId('stat-perhead-value')).toHaveTextContent('70')
  })
})
