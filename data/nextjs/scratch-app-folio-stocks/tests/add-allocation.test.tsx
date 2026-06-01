import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add holding flow', () => {
  it('blocks submitting with a blank symbol', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('shares-input'), '5')
    await user.type(screen.getByTestId('cost-input'), '100')
    await user.click(screen.getByTestId('submit-holding'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks submitting with non-positive shares', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'NVDA')
    await user.type(screen.getByTestId('shares-input'), '0')
    await user.type(screen.getByTestId('cost-input'), '100')
    await user.click(screen.getByTestId('submit-holding'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a holding and navigates to the portfolio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'nvda')
    await user.type(screen.getByTestId('shares-input'), '2')
    await user.type(screen.getByTestId('cost-input'), '100')
    await user.type(screen.getByTestId('price-input'), '150')
    await user.click(screen.getByTestId('submit-holding'))
    expect(screen.getByTestId('page-portfolio')).toBeInTheDocument()
    expect(within(screen.getByTestId('holding-list')).getByText('NVDA')).toBeInTheDocument()
    // 2 shares * 150 = 300; total 5600 + 300 = 5900
    expect(screen.getByTestId('holding-h4-value')).toHaveTextContent('300')
    expect(screen.getByTestId('stat-value-value')).toHaveTextContent('5900')
  })

  it('defaults the price to the cost basis when price is blank', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'AMD')
    await user.type(screen.getByTestId('shares-input'), '4')
    await user.type(screen.getByTestId('cost-input'), '50')
    await user.click(screen.getByTestId('submit-holding'))
    // price defaults to 50 => value 200, gain 0
    expect(screen.getByTestId('holding-h4-value')).toHaveTextContent('200')
    expect(screen.getByTestId('holding-h4-gainloss')).toHaveTextContent('0')
  })
})

describe('allocation view', () => {
  it('shows total value and per-holding allocation percentages', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-allocation'))
    expect(screen.getByTestId('allocation-total')).toHaveTextContent('5600')
    expect(screen.getByTestId('alloc-h1-percent')).toHaveTextContent('36') // 2000/5600
    expect(screen.getByTestId('alloc-h3-percent')).toHaveTextContent('29') // 1600/5600
    expect(screen.getByTestId('alloc-h2-value')).toHaveTextContent('2000')
  })
})
