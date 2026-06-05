import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('portfolio overview', () => {
  it('shows totals and balanced flag from seed data', () => {
    render(<App />)
    expect(screen.getByTestId('stat-value-value')).toHaveTextContent('10000')
    expect(screen.getByTestId('stat-target-total-value')).toHaveTextContent('100')
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-balanced-value')).toHaveTextContent('no')
  })

  it('shows actual vs target percent and flags drifted holdings', () => {
    render(<App />)
    expect(screen.getByTestId('holding-h1-actual')).toHaveTextContent('60')
    expect(screen.getByTestId('holding-h1-target')).toHaveTextContent('50')
    expect(screen.getByTestId('holding-h1')).toHaveAttribute('data-drifted', 'true')
    expect(screen.getByTestId('holding-h2-actual')).toHaveTextContent('30')
    expect(screen.getByTestId('holding-h2')).toHaveAttribute('data-drifted', 'false')
  })

  it('selecting a holding opens the targets page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-h1'))
    expect(screen.getByTestId('page-targets')).toBeInTheDocument()
  })
})

describe('targets page', () => {
  it('shows the target total and validity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-targets'))
    expect(screen.getByTestId('target-total')).toHaveTextContent('100')
    expect(screen.getByTestId('target-valid')).toBeInTheDocument()
  })

  it('adjusting a target updates the total and validity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-targets'))
    await user.click(screen.getByTestId('target-up-h1')) // 50 -> 55, total 105
    expect(screen.getByTestId('target-h1-percent')).toHaveTextContent('55')
    expect(screen.getByTestId('target-total')).toHaveTextContent('105')
    expect(screen.getByTestId('target-invalid')).toBeInTheDocument()
  })

  it('does not let a target go below zero', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-targets'))
    // CASH target 20 -> down 5 four times -> 0, then stays 0
    await user.click(screen.getByTestId('target-down-h3'))
    await user.click(screen.getByTestId('target-down-h3'))
    await user.click(screen.getByTestId('target-down-h3'))
    await user.click(screen.getByTestId('target-down-h3'))
    await user.click(screen.getByTestId('target-down-h3'))
    expect(screen.getByTestId('target-h3-percent')).toHaveTextContent('0')
  })

  it('adds a holding from the targets form', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-targets'))
    await user.type(screen.getByTestId('symbol-input'), 'reit')
    await user.type(screen.getByTestId('value-input'), '2000')
    await user.type(screen.getByTestId('target-input'), '10')
    await user.click(screen.getByTestId('submit-holding'))
    expect(within(screen.getByTestId('target-list')).getByText('REIT')).toBeInTheDocument()
    // total target 100 + 10 = 110
    expect(screen.getByTestId('target-total')).toHaveTextContent('110')
  })

  it('blocks adding a holding with a blank symbol', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-targets'))
    await user.type(screen.getByTestId('value-input'), '2000')
    await user.type(screen.getByTestId('target-input'), '10')
    await user.click(screen.getByTestId('submit-holding'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })
})
