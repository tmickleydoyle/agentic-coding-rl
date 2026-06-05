import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('portfolio overview', () => {
  it('shows totals from seed data', () => {
    render(<App />)
    // value 2000+2000+1600 = 5600; cost 1500+1500+2000 = 5000; gain 600; pct 12; count 3
    expect(screen.getByTestId('stat-value-value')).toHaveTextContent('5600')
    expect(screen.getByTestId('stat-cost-value')).toHaveTextContent('5000')
    expect(screen.getByTestId('stat-gainloss-value')).toHaveTextContent('600')
    expect(screen.getByTestId('stat-gainloss-percent-value')).toHaveTextContent('12')
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('3')
  })

  it('lists all holdings with market value', () => {
    render(<App />)
    const list = screen.getByTestId('holding-list')
    expect(within(list).getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByTestId('holding-h1-value')).toHaveTextContent('2000')
    expect(screen.getByTestId('holding-h3-value')).toHaveTextContent('1600')
  })

  it('flags gains and losses', () => {
    render(<App />)
    expect(screen.getByTestId('holding-h1')).toHaveAttribute('data-gain', 'true')
    expect(screen.getByTestId('holding-h3')).toHaveAttribute('data-gain', 'false')
    expect(screen.getByTestId('holding-h3-gainloss')).toHaveTextContent('-400')
  })

  it('selecting a holding opens its detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-h1'))
    expect(screen.getByTestId('page-holding-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-symbol')).toHaveTextContent('AAPL')
  })
})
