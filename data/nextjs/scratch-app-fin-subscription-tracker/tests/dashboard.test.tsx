import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('dashboard stats', () => {
  it('shows normalized monthly and annual totals over active subs', () => {
    render(<App />)
    // active: Netflix 15 + Spotify 10 + Amazon Prime 120/12=10 = 35; annual 420
    expect(screen.getByTestId('stat-monthly-value')).toHaveTextContent('35')
    expect(screen.getByTestId('stat-annual-value')).toHaveTextContent('420')
  })

  it('shows the active and due-soon counts', () => {
    render(<App />)
    expect(screen.getByTestId('stat-active-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-duesoon-value')).toHaveTextContent('2')
  })

  it('drops a cancelled subscription from the monthly total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscriptions'))
    await user.click(screen.getByTestId('cancel-s1')) // Netflix 15
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-monthly-value')).toHaveTextContent('20')
    expect(screen.getByTestId('stat-active-value')).toHaveTextContent('2')
  })

  it('adds a subscription and reflects it in the monthly total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Disney')
    await user.type(screen.getByTestId('cost-input'), '8')
    await user.type(screen.getByTestId('renewal-input'), '2026-07-01')
    await user.click(screen.getByTestId('submit-sub'))
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-monthly-value')).toHaveTextContent('43')
  })
})
