import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('pots page', () => {
  it('shows totals and the unallocated pool', () => {
    render(<App />)
    // saved 1500 + 800 + 200 = 2500
    expect(screen.getByTestId('stat-saved-value')).toHaveTextContent('2500')
    // goal 3000 + 800 + 1200 = 5000
    expect(screen.getByTestId('stat-goal-value')).toHaveTextContent('5000')
    expect(screen.getByTestId('stat-met-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('3')
    expect(screen.getByTestId('unallocated')).toHaveTextContent('1000')
  })

  it('shows per-pot progress and met flag', () => {
    render(<App />)
    // p1 1500/3000 = 50%, not met
    expect(screen.getByTestId('pot-p1-progress')).toHaveTextContent('50')
    expect(screen.getByTestId('pot-p1')).toHaveAttribute('data-met', 'false')
    // p2 800/800 = 100%, met
    expect(screen.getByTestId('pot-p2-progress')).toHaveTextContent('100')
    expect(screen.getByTestId('pot-p2')).toHaveAttribute('data-met', 'true')
    // p3 200/1200 rounds to 17%
    expect(screen.getByTestId('pot-p3-progress')).toHaveTextContent('17')
  })

  it('shows the current currency', () => {
    render(<App />)
    expect(screen.getByTestId('currency-label')).toHaveTextContent('USD')
  })

  it('opening a pot navigates to its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('pot-p1-open'))
    expect(screen.getByTestId('page-pot-detail')).toBeInTheDocument()
    expect(screen.getByTestId('pot-name')).toHaveTextContent('Emergency Fund')
  })
})
