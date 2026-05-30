import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('rebalance suggestions', () => {
  it('suggests SELL/HOLD/BUY for the seed drift', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-rebalance'))
    expect(screen.getByTestId('suggestion-h1-action')).toHaveTextContent('SELL')
    expect(screen.getByTestId('suggestion-h1-amount')).toHaveTextContent('1000')
    expect(screen.getByTestId('suggestion-h2-action')).toHaveTextContent('HOLD')
    expect(screen.getByTestId('suggestion-h3-action')).toHaveTextContent('BUY')
    expect(screen.getByTestId('suggestion-h3-amount')).toHaveTextContent('1000')
    expect(screen.getByTestId('suggestion-h1')).toHaveAttribute('data-action', 'SELL')
  })

  it('counts the number of trades (non-HOLD)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-rebalance'))
    expect(screen.getByTestId('trade-count')).toHaveTextContent('2')
  })

  it('shows already-balanced when targets match actuals', async () => {
    const user = userEvent.setup()
    render(<App />)
    // set targets to the actuals: STOCKS 60, CASH 10 (BONDS already 30)
    await user.click(screen.getByTestId('nav-targets'))
    await user.click(screen.getByTestId('target-up-h1')) // 50->55
    await user.click(screen.getByTestId('target-up-h1')) // 55->60
    await user.click(screen.getByTestId('target-down-h3')) // 20->15
    await user.click(screen.getByTestId('target-down-h3')) // 15->10
    await user.click(screen.getByTestId('nav-rebalance'))
    expect(screen.getByTestId('already-balanced')).toBeInTheDocument()
    expect(screen.getByTestId('trade-count')).toHaveTextContent('0')
  })

  it('applying a rebalance logs the trades to history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-rebalance'))
    await user.click(screen.getByTestId('apply-rebalance'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
    // 2 seed entries + 2 new trades = 4
    expect(screen.getByTestId('history-count')).toHaveTextContent('4')
    expect(screen.getByTestId('history-r3-symbol')).toHaveTextContent('STOCKS')
    expect(screen.getByTestId('history-r3-action')).toHaveTextContent('SELL')
    expect(screen.getByTestId('history-r4-symbol')).toHaveTextContent('CASH')
    expect(screen.getByTestId('history-r4-action')).toHaveTextContent('BUY')
  })
})

describe('history page', () => {
  it('lists the seeded rebalance entries', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-count')).toHaveTextContent('2')
    const list = screen.getByTestId('history-list')
    expect(within(list).getByTestId('history-r1-symbol')).toHaveTextContent('STOCKS')
    expect(within(list).getByTestId('history-r1-amount')).toHaveTextContent('500')
    expect(within(list).getByTestId('history-r2-date')).toHaveTextContent('2026-01-15')
  })
})
