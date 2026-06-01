import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('account detail', () => {
  it('shows the selected account transactions and kinds', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('account-a1-open'))
    expect(screen.getByTestId('txn-t1-desc')).toHaveTextContent('Paycheck')
    expect(screen.getByTestId('txn-t1')).toHaveAttribute('data-kind', 'deposit')
    expect(screen.getByTestId('txn-t2')).toHaveAttribute('data-kind', 'withdrawal')
    // a1's t4 belongs to a2, so it should not appear
    expect(screen.queryByTestId('txn-t4')).not.toBeInTheDocument()
  })

  it('computes deposit/withdrawal/count stats for the account', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('account-a1-open'))
    // a1: +3200, -1400, -260 => deposits 3200, withdrawals 1660, count 3
    expect(screen.getByTestId('stat-deposits-value')).toHaveTextContent('3200')
    expect(screen.getByTestId('stat-withdrawals-value')).toHaveTextContent('1660')
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('3')
  })

  it('shows the account balance', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('account-a3-open'))
    expect(screen.getByTestId('account-balance')).toHaveTextContent('1200')
  })

  it('shows no-selection placeholder when navigated directly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-account-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
    expect(screen.queryByTestId('txn-list')).not.toBeInTheDocument()
  })
})
