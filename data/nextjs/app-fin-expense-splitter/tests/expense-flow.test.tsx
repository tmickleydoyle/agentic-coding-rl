import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToExpenses(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-expenses'))
}

describe('expense flow', () => {
  it('lists seeded expenses with payer names', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToExpenses(user)
    const list = screen.getByTestId('expense-list')
    expect(within(list).getByText('Dinner')).toBeInTheDocument()
    expect(screen.getByTestId('expense-e1-payer')).toHaveTextContent('Alice')
    expect(screen.getByTestId('expense-e2-payer')).toHaveTextContent('Bob')
  })

  it('blocks submitting with a blank description', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToExpenses(user)
    await user.type(screen.getByTestId('amount-input'), '20')
    await user.click(screen.getByTestId('submit-expense'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('blocks submitting with a non-positive amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToExpenses(user)
    await user.type(screen.getByTestId('description-input'), 'Snacks')
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.click(screen.getByTestId('submit-expense'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds an expense paid by a chosen person', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToExpenses(user)
    await user.type(screen.getByTestId('description-input'), 'Brunch')
    await user.type(screen.getByTestId('amount-input'), '45')
    await user.selectOptions(screen.getByTestId('payer-select'), 'u3')
    await user.click(screen.getByTestId('submit-expense'))
    expect(within(screen.getByTestId('expense-list')).getByText('Brunch')).toBeInTheDocument()
    expect(screen.getByTestId('expense-e4-payer')).toHaveTextContent('Carol')
  })

  it('removes an expense', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToExpenses(user)
    expect(screen.getByTestId('expense-e2')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-e2'))
    expect(screen.queryByTestId('expense-e2')).not.toBeInTheDocument()
  })
})
