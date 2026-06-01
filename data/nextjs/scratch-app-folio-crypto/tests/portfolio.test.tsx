import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('portfolio overview', () => {
  it('shows totals from seed data', () => {
    render(<App />)
    // value 30000+12000+5000 = 47000; change 1500-240+500 = 1760; pct 4; count 3
    expect(screen.getByTestId('stat-value-value')).toHaveTextContent('47000')
    expect(screen.getByTestId('stat-change-value')).toHaveTextContent('1760')
    expect(screen.getByTestId('stat-change-percent-value')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('3')
  })

  it('lists all coins with value and 24h change', () => {
    render(<App />)
    const list = screen.getByTestId('coin-list')
    expect(within(list).getByText('BTC')).toBeInTheDocument()
    expect(screen.getByTestId('coin-c1-value')).toHaveTextContent('30000')
    expect(screen.getByTestId('coin-c1-change-amount')).toHaveTextContent('1500')
    expect(screen.getByTestId('coin-c2-change-amount')).toHaveTextContent('-240')
  })

  it('flags coins up or down over 24h', () => {
    render(<App />)
    expect(screen.getByTestId('coin-c1')).toHaveAttribute('data-up', 'true')
    expect(screen.getByTestId('coin-c2')).toHaveAttribute('data-up', 'false')
  })

  it('selecting a coin opens its detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-c3'))
    expect(screen.getByTestId('page-coin-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-symbol')).toHaveTextContent('SOL')
  })
})
