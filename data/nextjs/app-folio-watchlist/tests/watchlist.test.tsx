import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('watchlist overview', () => {
  it('shows ticker and alert counts from seed data', () => {
    render(<App />)
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-alerts-value')).toHaveTextContent('2')
  })

  it('lists all tickers with target and direction', () => {
    render(<App />)
    const list = screen.getByTestId('ticker-list')
    expect(within(list).getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByTestId('ticker-t1-target')).toHaveTextContent('180')
    expect(screen.getByTestId('ticker-t3-direction')).toHaveTextContent('below')
  })

  it('flags which tickers have hit their alert', () => {
    render(<App />)
    expect(screen.getByTestId('ticker-t1')).toHaveAttribute('data-alert', 'true')
    expect(screen.getByTestId('ticker-t2')).toHaveAttribute('data-alert', 'false')
    expect(screen.getByTestId('ticker-t3')).toHaveAttribute('data-alert', 'true')
    expect(screen.getByTestId('ticker-t4')).toHaveAttribute('data-alert', 'false')
    expect(screen.getByTestId('ticker-t1-hit')).toBeInTheDocument()
    expect(screen.queryByTestId('ticker-t2-hit')).not.toBeInTheDocument()
  })

  it('removes a ticker from the list and updates counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('remove-t1'))
    expect(screen.queryByTestId('ticker-t1')).not.toBeInTheDocument()
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-alerts-value')).toHaveTextContent('1')
  })

  it('selecting a ticker opens its detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-t3'))
    expect(screen.getByTestId('page-ticker-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-symbol')).toHaveTextContent('GOOG')
  })
})
