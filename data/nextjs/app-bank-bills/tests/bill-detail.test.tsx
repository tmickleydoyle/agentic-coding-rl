import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('bill detail', () => {
  it('pays an unpaid bill and reflects it in totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('bill-b1-open'))
    expect(screen.getByTestId('bill-status')).toHaveTextContent('overdue')
    await user.click(screen.getByTestId('pay-button'))
    expect(screen.getByTestId('bill-status')).toHaveTextContent('paid')
    expect(screen.getByTestId('already-paid')).toBeInTheDocument()
    expect(screen.queryByTestId('pay-button')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('nav-bills'))
    // paid count goes 1 -> 2, unpaid 3 -> 2
    expect(screen.getByTestId('stat-paid-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-unpaid-value')).toHaveTextContent('2')
  })

  it('shows already-paid for a paid bill with no pay button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('bill-b2-open'))
    expect(screen.getByTestId('already-paid')).toBeInTheDocument()
    expect(screen.queryByTestId('pay-button')).not.toBeInTheDocument()
  })

  it('toggles autopay on and off', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('bill-b1-open'))
    expect(screen.getByTestId('autopay-state')).toHaveTextContent('off')
    await user.click(screen.getByTestId('autopay-toggle'))
    expect(screen.getByTestId('autopay-state')).toHaveTextContent('on')

    await user.click(screen.getByTestId('nav-bills'))
    // autopay count goes 2 -> 3
    expect(screen.getByTestId('stat-autopay-value')).toHaveTextContent('3')
  })

  it('shows no-selection when navigated directly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-bill-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})
