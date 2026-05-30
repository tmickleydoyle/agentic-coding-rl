import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('quotes flow', () => {
  it('lists quotes with computed totals from seed', () => {
    render(<App />)
    expect(screen.getByTestId('quote-q1-total')).toHaveTextContent('200')
    expect(screen.getByTestId('quote-q2-total')).toHaveTextContent('600')
    expect(screen.getByTestId('quote-q3-total')).toHaveTextContent('650')
  })

  it('shows each quote status on the row', () => {
    render(<App />)
    expect(screen.getByTestId('quote-q1')).toHaveAttribute('data-status', 'sent')
    expect(screen.getByTestId('quote-q2')).toHaveAttribute('data-status', 'accepted')
  })

  it('filters quotes by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('status-filter'), 'draft')
    expect(screen.getByTestId('quote-q3')).toBeInTheDocument()
    expect(screen.queryByTestId('quote-q1')).not.toBeInTheDocument()
  })

  it('shows an empty state when no quote matches the filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('status-filter'), 'rejected')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('quote-list')).not.toBeInTheDocument()
  })

  it('opens a quote detail with line items and subtotals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q1'))
    expect(screen.getByTestId('page-quote-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-client')).toHaveTextContent('Acme')
    expect(screen.getByTestId('detail-total')).toHaveTextContent('200')
    expect(screen.getByTestId('item-0-subtotal')).toHaveTextContent('100')
    expect(screen.getByTestId('item-1-subtotal')).toHaveTextContent('100')
  })

  it('changes a quote status from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q3'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('draft')
    await user.click(screen.getByTestId('set-accepted'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('accepted')
  })

  it('reflects a status change back on the quotes list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q1'))
    await user.click(screen.getByTestId('set-rejected'))
    await user.click(screen.getByTestId('nav-quotes'))
    expect(screen.getByTestId('quote-q1')).toHaveAttribute('data-status', 'rejected')
  })
})
