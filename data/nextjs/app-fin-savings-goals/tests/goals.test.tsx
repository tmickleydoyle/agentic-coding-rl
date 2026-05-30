import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('goals overview', () => {
  it('shows totals from seed data', () => {
    render(<App />)
    // saved 4000+3000+500 = 7500; target 10000+3000+2000 = 15000; completed 1; overall 50
    expect(screen.getByTestId('stat-saved-value')).toHaveTextContent('7500')
    expect(screen.getByTestId('stat-target-value')).toHaveTextContent('15000')
    expect(screen.getByTestId('stat-completed-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-percent-value')).toHaveTextContent('50')
  })

  it('lists all goals with progress percentages', () => {
    render(<App />)
    const list = screen.getByTestId('goal-list')
    expect(within(list).getByText('Emergency Fund')).toBeInTheDocument()
    expect(screen.getByTestId('goal-g1-percent')).toHaveTextContent('40') // 4000/10000
    expect(screen.getByTestId('goal-g3-percent')).toHaveTextContent('25') // 500/2000
  })

  it('flags completed goals', () => {
    render(<App />)
    expect(screen.getByTestId('goal-g2')).toHaveAttribute('data-complete', 'true')
    expect(screen.getByTestId('goal-g1')).toHaveAttribute('data-complete', 'false')
  })

  it('selecting a goal opens its detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-g1'))
    expect(screen.getByTestId('page-goal-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Emergency Fund')
  })
})
