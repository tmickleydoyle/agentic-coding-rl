import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('ticker detail', () => {
  it('shows a hit alert and signed distance for AAPL', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-t1'))
    expect(screen.getByTestId('detail-price')).toHaveTextContent('200')
    expect(screen.getByTestId('detail-target')).toHaveTextContent('180')
    expect(screen.getByTestId('detail-distance')).toHaveTextContent('-20') // 180-200
    expect(screen.getByTestId('detail-alert-hit')).toBeInTheDocument()
  })

  it('shows a pending alert for MSFT', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-t2'))
    expect(screen.getByTestId('detail-distance')).toHaveTextContent('50') // 450-400
    expect(screen.getByTestId('detail-alert-pending')).toBeInTheDocument()
  })

  it('removes the ticker and returns to the watchlist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-t1'))
    await user.click(screen.getByTestId('remove-ticker'))
    expect(screen.getByTestId('page-watchlist')).toBeInTheDocument()
    expect(screen.queryByTestId('ticker-t1')).not.toBeInTheDocument()
  })
})

describe('alerts view', () => {
  it('lists only the tickers that have hit their alert', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-alerts'))
    expect(screen.getByTestId('alert-count')).toHaveTextContent('2')
    const list = screen.getByTestId('alert-list')
    expect(within(list).getByTestId('alert-t1')).toBeInTheDocument()
    expect(within(list).getByTestId('alert-t3')).toBeInTheDocument()
    expect(within(list).queryByTestId('alert-t2')).not.toBeInTheDocument()
  })

  it('navigates from an alert to the ticker detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-alerts'))
    await user.click(screen.getByTestId('alert-select-t3'))
    expect(screen.getByTestId('page-ticker-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-symbol')).toHaveTextContent('GOOG')
  })

  it('shows the empty state when no alerts are hit', async () => {
    const user = userEvent.setup()
    render(<App />)
    // remove the two hit tickers t1 and t3
    await user.click(screen.getByTestId('remove-t1'))
    await user.click(screen.getByTestId('remove-t3'))
    await user.click(screen.getByTestId('nav-alerts'))
    expect(screen.getByTestId('empty-alerts')).toBeInTheDocument()
    expect(screen.getByTestId('alert-count')).toHaveTextContent('0')
  })
})
