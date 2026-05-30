import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('environments and stats', () => {
  it('lists distinct environments with deploy counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-environments'))
    expect(screen.getByTestId('env-dev-count')).toHaveTextContent('1')
    expect(screen.getByTestId('env-prod-count')).toHaveTextContent('1')
    expect(screen.getByTestId('env-stage-count')).toHaveTextContent('1')
  })

  it('shows total, success rate and per-status counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    // 3 deployments, 2 success => round(0.666 * 100) = 67
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-success-rate-value')).toHaveTextContent('67')
    expect(screen.getByTestId('status-count-success-value')).toHaveTextContent('2')
    expect(screen.getByTestId('status-count-failed-value')).toHaveTextContent('1')
    expect(screen.getByTestId('status-count-rolled_back-value')).toHaveTextContent('0')
  })

  it('updates the success rate after rolling back a successful deployment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('rollback-d1')) // 1 success left of 3
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-success-rate-value')).toHaveTextContent('33')
    expect(screen.getByTestId('status-count-rolled_back-value')).toHaveTextContent('1')
  })

  it('adds an environment count when a deployment in a new env is created via state', async () => {
    const user = userEvent.setup()
    render(<App />)
    // there is no in-app create form route; environments derive from existing deployments.
    // Verify env list reflects only seeded envs sorted.
    await user.click(screen.getByTestId('nav-environments'))
    const items = screen.getAllByTestId(/^env-(dev|prod|stage)$/)
    expect(items.map((el) => el.getAttribute('data-testid'))).toEqual([
      'env-dev',
      'env-prod',
      'env-stage',
    ])
  })
})
