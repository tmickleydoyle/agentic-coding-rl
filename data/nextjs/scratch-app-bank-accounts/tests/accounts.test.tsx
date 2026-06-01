import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('accounts page', () => {
  it('lists the seeded accounts with names, kinds, balances', () => {
    render(<App />)
    expect(screen.getByTestId('account-a1-name')).toHaveTextContent('Everyday Checking')
    expect(screen.getByTestId('account-a1-kind')).toHaveTextContent('checking')
    expect(screen.getByTestId('account-a1-balance')).toHaveTextContent('2500')
    expect(screen.getByTestId('account-a2-balance')).toHaveTextContent('8000')
    expect(screen.getByTestId('account-a3-name')).toHaveTextContent('Travel Fund')
  })

  it('shows the total balance across all accounts', () => {
    render(<App />)
    // 2500 + 8000 + 1200 = 11700
    expect(screen.getByTestId('total-balance')).toHaveTextContent('11700')
  })

  it('shows the current currency', () => {
    render(<App />)
    expect(screen.getByTestId('currency-label')).toHaveTextContent('USD')
  })

  it('opening an account navigates to its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('account-a1-open'))
    expect(screen.getByTestId('page-account-detail')).toBeInTheDocument()
    expect(screen.getByTestId('account-name')).toHaveTextContent('Everyday Checking')
  })
})
