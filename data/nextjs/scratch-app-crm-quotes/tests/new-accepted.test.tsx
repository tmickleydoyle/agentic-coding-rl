import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('new quote and accepted view', () => {
  it('blocks submitting without a client', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.click(screen.getByTestId('submit-quote'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
  })

  it('creates a quote with a computed total and lands on its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('client-input'), 'Umbrella')
    await user.type(screen.getByTestId('desc-input'), 'Consulting')
    await user.type(screen.getByTestId('qty-input'), '4')
    await user.type(screen.getByTestId('price-input'), '25')
    await user.click(screen.getByTestId('submit-quote'))
    expect(screen.getByTestId('page-quote-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-client')).toHaveTextContent('Umbrella')
    expect(screen.getByTestId('detail-total')).toHaveTextContent('100')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('draft')
  })

  it('a new draft quote shows up in the quotes list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('client-input'), 'Stark')
    await user.click(screen.getByTestId('submit-quote'))
    await user.click(screen.getByTestId('nav-quotes'))
    expect(screen.getByTestId('quote-q4')).toBeInTheDocument()
    expect(screen.getByTestId('quote-q4')).toHaveAttribute('data-status', 'draft')
  })

  it('accepted page lists only accepted quotes and sums their totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-accepted'))
    const list = screen.getByTestId('accepted-list')
    expect(within(list).getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByTestId('accepted-q1')).not.toBeInTheDocument()
    // only q2 (600) accepted at seed
    expect(screen.getByTestId('accepted-total')).toHaveTextContent('600')
  })

  it('accepted total updates after accepting another quote', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q1'))
    await user.click(screen.getByTestId('set-accepted'))
    await user.click(screen.getByTestId('nav-accepted'))
    // q2 (600) + q1 (200) = 800
    expect(screen.getByTestId('accepted-total')).toHaveTextContent('800')
    expect(screen.getByTestId('accepted-q1')).toBeInTheDocument()
  })
})
