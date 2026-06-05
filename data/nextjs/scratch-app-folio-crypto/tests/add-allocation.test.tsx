import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add coin flow', () => {
  it('blocks submitting with a blank symbol', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('amount-input'), '1')
    await user.type(screen.getByTestId('price-input'), '100')
    await user.click(screen.getByTestId('submit-coin'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks submitting with a non-positive amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'ADA')
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.type(screen.getByTestId('price-input'), '1')
    await user.click(screen.getByTestId('submit-coin'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a coin and navigates to the portfolio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'ada')
    await user.type(screen.getByTestId('amount-input'), '100')
    await user.type(screen.getByTestId('price-input'), '2')
    await user.type(screen.getByTestId('change-input'), '8')
    await user.click(screen.getByTestId('submit-coin'))
    expect(screen.getByTestId('page-portfolio')).toBeInTheDocument()
    expect(within(screen.getByTestId('coin-list')).getByText('ADA')).toBeInTheDocument()
    // 100 * 2 = 200 value; change 200 * 8% = 16
    expect(screen.getByTestId('coin-c4-value')).toHaveTextContent('200')
    expect(screen.getByTestId('coin-c4-change-amount')).toHaveTextContent('16')
    expect(screen.getByTestId('stat-value-value')).toHaveTextContent('47200')
  })

  it('defaults the 24h change to 0 when blank', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'DOT')
    await user.type(screen.getByTestId('amount-input'), '10')
    await user.type(screen.getByTestId('price-input'), '5')
    await user.click(screen.getByTestId('submit-coin'))
    expect(screen.getByTestId('coin-c4-change')).toHaveTextContent('0')
    expect(screen.getByTestId('coin-c4-change-amount')).toHaveTextContent('0')
  })
})

describe('allocation view', () => {
  it('shows total value and per-coin allocation percentages', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-allocation'))
    expect(screen.getByTestId('allocation-total')).toHaveTextContent('47000')
    expect(screen.getByTestId('alloc-c1-percent')).toHaveTextContent('64') // 30000/47000
    expect(screen.getByTestId('alloc-c3-percent')).toHaveTextContent('11') // 5000/47000
    expect(screen.getByTestId('alloc-c2-value')).toHaveTextContent('12000')
  })
})
