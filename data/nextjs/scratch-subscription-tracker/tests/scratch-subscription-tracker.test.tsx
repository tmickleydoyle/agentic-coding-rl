import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Subscription Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders 6 seed subscriptions', () => {
    expect(screen.getAllByTestId('subscription-row')).toHaveLength(6)
  })

  it('shows correct monthly total', () => {
    // 15.99+9.99+50+4+2.99 = 82.97
    expect(screen.getByTestId('monthly-total').textContent).toContain('$82.97')
  })

  it('shows correct yearly total', () => {
    // 82.97*12 + 17 = 995.64 + 17 = 1012.64
    expect(screen.getByTestId('yearly-total').textContent).toContain('$1012.64')
  })

  it('shows subscription count of 6', () => {
    expect(screen.getByTestId('subscription-count').textContent).toContain('6')
  })

  it('filters by monthly cycle', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by cycle/i), 'monthly')
    expect(screen.getAllByTestId('subscription-row')).toHaveLength(5)
  })

  it('filters by yearly cycle', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by cycle/i), 'yearly')
    expect(screen.getAllByTestId('subscription-row')).toHaveLength(1)
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Entertainment')
    expect(screen.getAllByTestId('subscription-row')).toHaveLength(2)
  })

  it('applies both filters simultaneously', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by cycle/i), 'monthly')
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Productivity')
    expect(screen.getAllByTestId('subscription-row')).toHaveLength(2)
  })

  it('summaries remain unaffected by filter', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by cycle/i), 'yearly')
    // Summary still shows all subs
    expect(screen.getByTestId('subscription-count').textContent).toContain('6')
    expect(screen.getByTestId('monthly-total').textContent).toContain('$82.97')
  })

  it('cancels a subscription', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByRole('button', { name: /cancel/i })[0])
    expect(screen.getAllByTestId('subscription-row')).toHaveLength(5)
    expect(screen.getByTestId('subscription-count').textContent).toContain('5')
  })

  it('recalculates monthly total after cancel', async () => {
    const user = userEvent.setup()
    // Cancel Netflix (15.99)
    await user.click(screen.getAllByRole('button', { name: /cancel/i })[0])
    // 82.97 - 15.99 = 66.98
    expect(screen.getByTestId('monthly-total').textContent).toContain('$66.98')
  })

  it('adds a new subscription', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/subscription name/i), 'Hulu')
    await user.type(screen.getByLabelText(/^cost$/i), '7.99')
    await user.click(screen.getByRole('button', { name: /add subscription/i }))
    expect(screen.getAllByTestId('subscription-row')).toHaveLength(7)
    expect(screen.getByText('Hulu')).toBeInTheDocument()
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/subscription name/i), 'Hulu')
    await user.click(screen.getByRole('button', { name: /add subscription/i }))
    expect(screen.getByLabelText(/subscription name/i)).toHaveValue('')
  })

  it('does not add subscription with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add subscription/i }))
    expect(screen.getAllByTestId('subscription-row')).toHaveLength(6)
  })
})
