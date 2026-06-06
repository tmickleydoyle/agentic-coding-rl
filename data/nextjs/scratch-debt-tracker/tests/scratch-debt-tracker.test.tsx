import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Debt Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders 3 seed debt rows', () => {
    expect(screen.getAllByTestId('debt-row')).toHaveLength(3)
  })

  it('shows correct total debt', () => {
    // 3500+12000+1200 = 16700
    expect(screen.getByTestId('total-debt').textContent).toContain('$16700.00')
  })

  it('shows correct total min payment', () => {
    // 75+250+50 = 375
    expect(screen.getByTestId('total-min-payment').textContent).toContain('$375.00')
  })

  it('shows 3 debts remaining', () => {
    expect(screen.getByTestId('debts-remaining').textContent).toContain('3')
  })

  it('makes a payment and reduces balance', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByRole('button', { name: /make payment/i })[0])
    await user.type(screen.getByLabelText(/payment for credit card/i), '500')
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    // balance should be 3500-500=3000
    const balances = screen.getAllByTestId('debt-balance')
    expect(balances[0].textContent).toContain('$3000.00')
  })

  it('recalculates total debt after payment', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByRole('button', { name: /make payment/i })[0])
    await user.type(screen.getByLabelText(/payment for credit card/i), '500')
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    // 3000+12000+1200 = 16200
    expect(screen.getByTestId('total-debt').textContent).toContain('$16200.00')
  })

  it('shows Paid Off badge when balance reaches zero', async () => {
    const user = userEvent.setup()
    // Pay off Medical Bill fully
    await user.click(screen.getAllByRole('button', { name: /make payment/i })[2])
    await user.type(screen.getByLabelText(/payment for medical bill/i), '1200')
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(screen.getAllByTestId('paid-off-badge')).toHaveLength(1)
  })

  it('payment larger than balance floors to zero', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByRole('button', { name: /make payment/i })[2])
    await user.type(screen.getByLabelText(/payment for medical bill/i), '9999')
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    const balances = screen.getAllByTestId('debt-balance')
    expect(balances[2].textContent).toContain('$0.00')
  })

  it('decrements debts remaining when debt paid off', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByRole('button', { name: /make payment/i })[2])
    await user.type(screen.getByLabelText(/payment for medical bill/i), '1200')
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(screen.getByTestId('debts-remaining').textContent).toContain('2')
  })

  it('adds a new debt', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/debt name/i), 'Mortgage')
    await user.type(screen.getByLabelText(/^balance$/i), '200000')
    await user.type(screen.getByLabelText(/interest rate/i), '3.5')
    await user.type(screen.getByLabelText(/min payment/i), '1000')
    await user.click(screen.getByRole('button', { name: /add debt/i }))
    expect(screen.getAllByTestId('debt-row')).toHaveLength(4)
  })

  it('does not add debt with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add debt/i }))
    expect(screen.getAllByTestId('debt-row')).toHaveLength(3)
  })

  it('clears form after adding debt', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/debt name/i), 'Mortgage')
    await user.click(screen.getByRole('button', { name: /add debt/i }))
    expect(screen.getByLabelText(/debt name/i)).toHaveValue('')
  })
})
