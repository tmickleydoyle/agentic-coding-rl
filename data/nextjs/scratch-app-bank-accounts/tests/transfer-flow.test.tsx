import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('transfer flow', () => {
  it('transfers funds between accounts and updates balances', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transfer'))
    await user.selectOptions(screen.getByTestId('from-select'), 'a1')
    await user.selectOptions(screen.getByTestId('to-select'), 'a3')
    await user.type(screen.getByTestId('amount-input'), '500')
    await user.click(screen.getByTestId('submit-transfer'))
    expect(screen.getByTestId('transfer-success')).toBeInTheDocument()

    await user.click(screen.getByTestId('nav-accounts'))
    // a1: 2500 - 500 = 2000, a3: 1200 + 500 = 1700
    expect(screen.getByTestId('account-a1-balance')).toHaveTextContent('2000')
    expect(screen.getByTestId('account-a3-balance')).toHaveTextContent('1700')
    // total unchanged
    expect(screen.getByTestId('total-balance')).toHaveTextContent('11700')
  })

  it('records two transactions on a successful transfer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transfer'))
    await user.selectOptions(screen.getByTestId('from-select'), 'a1')
    await user.selectOptions(screen.getByTestId('to-select'), 'a2')
    await user.type(screen.getByTestId('amount-input'), '100')
    await user.click(screen.getByTestId('submit-transfer'))

    await user.click(screen.getByTestId('nav-accounts'))
    await user.click(screen.getByTestId('account-a1-open'))
    expect(screen.getByTestId('txn-t7')).toHaveAttribute('data-kind', 'withdrawal')
    expect(screen.getByTestId('txn-t7-amount')).toHaveTextContent('-100')
  })

  it('rejects a transfer with insufficient funds', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transfer'))
    await user.selectOptions(screen.getByTestId('from-select'), 'a3')
    await user.selectOptions(screen.getByTestId('to-select'), 'a1')
    await user.type(screen.getByTestId('amount-input'), '5000')
    await user.click(screen.getByTestId('submit-transfer'))
    expect(screen.getByTestId('transfer-error')).toHaveTextContent('insufficient funds')

    await user.click(screen.getByTestId('nav-accounts'))
    expect(screen.getByTestId('account-a3-balance')).toHaveTextContent('1200')
  })

  it('rejects a transfer to the same account', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transfer'))
    await user.selectOptions(screen.getByTestId('from-select'), 'a1')
    await user.selectOptions(screen.getByTestId('to-select'), 'a1')
    await user.type(screen.getByTestId('amount-input'), '50')
    await user.click(screen.getByTestId('submit-transfer'))
    expect(screen.getByTestId('transfer-error')).toHaveTextContent('same account')
  })

  it('rejects a non-positive amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transfer'))
    await user.selectOptions(screen.getByTestId('from-select'), 'a1')
    await user.selectOptions(screen.getByTestId('to-select'), 'a2')
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.click(screen.getByTestId('submit-transfer'))
    expect(screen.getByTestId('transfer-error')).toHaveTextContent('amount must be positive')
  })
})
