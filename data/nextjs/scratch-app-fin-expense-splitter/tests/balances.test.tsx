import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToBalances(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-balances'))
}

describe('balances and settle-up', () => {
  it('shows each person net balance from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToBalances(user)
    expect(screen.getByTestId('balance-u1-net')).toHaveTextContent('90')
    expect(screen.getByTestId('balance-u2-net')).toHaveTextContent('-30')
    expect(screen.getByTestId('balance-u3-net')).toHaveTextContent('-60')
  })

  it('marks who is owed vs who owes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToBalances(user)
    expect(screen.getByTestId('balance-u1')).toHaveAttribute('data-status', 'owed')
    expect(screen.getByTestId('balance-u2')).toHaveAttribute('data-status', 'owes')
    expect(screen.getByTestId('balance-u3')).toHaveAttribute('data-status', 'owes')
  })

  it('suggests a settle-up plan that pays the creditor', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToBalances(user)
    const list = screen.getByTestId('settlement-list')
    // greedy over debtors in person order: Bob (-30) then Carol (-60), both pay Alice
    expect(within(list).getAllByTestId(/settlement-\d+-to$/).length).toBe(2)
    expect(screen.getByTestId('settlement-0-from')).toHaveTextContent('Bob')
    expect(screen.getByTestId('settlement-0-to')).toHaveTextContent('Alice')
    expect(screen.getByTestId('settlement-0-amount')).toHaveTextContent('30')
    expect(screen.getByTestId('settlement-1-from')).toHaveTextContent('Carol')
    expect(screen.getByTestId('settlement-1-to')).toHaveTextContent('Alice')
    expect(screen.getByTestId('settlement-1-amount')).toHaveTextContent('60')
  })

  it('shows all-settled when everyone has paid an equal share', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-expenses'))
    // seed paid: Alice 150, Bob 30, Carol 0. Bring Bob +120 and Carol +150 so all = 150.
    await user.type(screen.getByTestId('description-input'), 'Bob pays')
    await user.type(screen.getByTestId('amount-input'), '120')
    await user.selectOptions(screen.getByTestId('payer-select'), 'u2')
    await user.click(screen.getByTestId('submit-expense'))
    await user.type(screen.getByTestId('description-input'), 'Carol pays')
    await user.type(screen.getByTestId('amount-input'), '150')
    await user.selectOptions(screen.getByTestId('payer-select'), 'u3')
    await user.click(screen.getByTestId('submit-expense'))
    // totals 150/150/150 = 450, share 150 each -> all net 0
    await goToBalances(user)
    expect(screen.getByTestId('balance-u1-net')).toHaveTextContent('0')
    expect(screen.getByTestId('all-settled')).toBeInTheDocument()
    expect(screen.queryByTestId('settlement-list')).not.toBeInTheDocument()
  })
})
