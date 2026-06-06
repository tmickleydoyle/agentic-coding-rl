import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Savings Goal Calculator', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /savings goal/i })).toBeInTheDocument()
  })

  it('shows -- and $0.00 initially', () => {
    render(<App />)
    expect(screen.getByTestId('months-to-goal').textContent).toBe('--')
    expect(screen.getByTestId('total-contributed').textContent).toBe('$0.00')
    expect(screen.getByTestId('total-interest').textContent).toBe('$0.00')
    expect(screen.getByTestId('final-amount').textContent).toBe('$0.00')
  })

  it('calculates months to goal with no interest', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '1200')
    await user.type(screen.getByLabelText('Monthly Contribution'), '100')
    // 1200 / 100 = 12 months
    expect(screen.getByTestId('months-to-goal').textContent).toBe('12')
  })

  it('accounts for current savings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '1200')
    await user.type(screen.getByLabelText('Current Savings'), '600')
    await user.type(screen.getByLabelText('Monthly Contribution'), '100')
    // Need 600 more, 100/month = 6 months
    expect(screen.getByTestId('months-to-goal').textContent).toBe('6')
  })

  it('shows total contributed correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '1200')
    await user.type(screen.getByLabelText('Monthly Contribution'), '100')
    // 12 months * 100 = $1200 contributed
    expect(screen.getByTestId('total-contributed').textContent).toBe('$1200.00')
  })

  it('calculates with interest', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '10000')
    await user.type(screen.getByLabelText('Monthly Contribution'), '200')
    await user.type(screen.getByLabelText('Annual Interest Rate'), '6')
    // With 6% annual interest, should reach $10k faster than 50 months
    const months = parseInt(screen.getByTestId('months-to-goal').textContent || '0')
    expect(months).toBeGreaterThan(0)
    expect(months).toBeLessThan(50)
  })

  it('total interest is 0 with 0% rate', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '500')
    await user.type(screen.getByLabelText('Monthly Contribution'), '100')
    // 5 months, no interest
    expect(screen.getByTestId('total-interest').textContent).toBe('$0.00')
  })

  it('shows 0 months when current savings already meets goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '500')
    await user.type(screen.getByLabelText('Current Savings'), '600')
    await user.type(screen.getByLabelText('Monthly Contribution'), '100')
    expect(screen.getByTestId('months-to-goal').textContent).toBe('0')
  })

  it('final amount is at least the goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '1000')
    await user.type(screen.getByLabelText('Monthly Contribution'), '300')
    const final = parseFloat(
      screen.getByTestId('final-amount').textContent!.replace('$', '')
    )
    expect(final).toBeGreaterThanOrEqual(1000)
  })

  it('reset button clears all fields', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '5000')
    await user.type(screen.getByLabelText('Monthly Contribution'), '200')
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('months-to-goal').textContent).toBe('--')
    expect(screen.getByTestId('total-contributed').textContent).toBe('$0.00')
  })

  it('shows -- when monthly contribution is missing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '1000')
    expect(screen.getByTestId('months-to-goal').textContent).toBe('--')
  })

  it('updates live when inputs change', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Goal Amount'), '1200')
    await user.type(screen.getByLabelText('Monthly Contribution'), '100')
    const m1 = screen.getByTestId('months-to-goal').textContent
    await user.clear(screen.getByLabelText('Monthly Contribution'))
    await user.type(screen.getByLabelText('Monthly Contribution'), '200')
    const m2 = screen.getByTestId('months-to-goal').textContent
    expect(m1).not.toBe(m2)
  })
})
