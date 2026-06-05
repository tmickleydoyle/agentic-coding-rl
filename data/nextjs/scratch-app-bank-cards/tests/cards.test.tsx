import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('cards page', () => {
  it('shows totals across all cards', () => {
    render(<App />)
    // limits 1000 + 2000 + 500 = 3500
    expect(screen.getByTestId('stat-limit-value')).toHaveTextContent('3500')
    // spent 100 + 800 + 0 = 900
    expect(screen.getByTestId('stat-spent-value')).toHaveTextContent('900')
    expect(screen.getByTestId('stat-frozen-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('3')
  })

  it('shows per-card spent and remaining derived from charges', () => {
    render(<App />)
    // k1 spent 6+54+40 = 100, remaining 900
    expect(screen.getByTestId('card-k1-spent')).toHaveTextContent('100')
    expect(screen.getByTestId('card-k1-remaining')).toHaveTextContent('900')
    // k2 spent 320+480 = 800, remaining 1200
    expect(screen.getByTestId('card-k2-spent')).toHaveTextContent('800')
    expect(screen.getByTestId('card-k2-remaining')).toHaveTextContent('1200')
  })

  it('marks frozen cards', () => {
    render(<App />)
    expect(screen.getByTestId('card-k3')).toHaveAttribute('data-frozen', 'true')
    expect(screen.getByTestId('card-k1')).toHaveAttribute('data-frozen', 'false')
    expect(screen.getByTestId('card-k1-last4')).toHaveTextContent('4242')
  })

  it('opening a card navigates to its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('card-k2-open'))
    expect(screen.getByTestId('page-card-detail')).toBeInTheDocument()
    expect(screen.getByTestId('card-label')).toHaveTextContent('Travel Mastercard')
  })
})
