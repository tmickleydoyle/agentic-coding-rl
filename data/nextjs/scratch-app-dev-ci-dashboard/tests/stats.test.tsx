import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('stats', () => {
  it('shows totals from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    // seed: 5 builds, 3 passing, 1 failing, 1 running
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('5')
    expect(screen.getByTestId('stat-passing-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-failing-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-running-value')).toHaveTextContent('1')
  })

  it('computes the success rate over finished builds', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    // 3 passing / (3 passing + 1 failing) = 75%
    expect(screen.getByTestId('stat-success-rate-value')).toHaveTextContent('75')
  })

  it('shows per-pipeline build counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('pipeline-builds-pl1-value')).toHaveTextContent('2')
    expect(screen.getByTestId('pipeline-builds-pl2-value')).toHaveTextContent('2')
    expect(screen.getByTestId('pipeline-builds-pl3-value')).toHaveTextContent('1')
  })

  it('updates the success rate after retrying a failing build', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-pl1'))
    await user.click(screen.getByTestId('retry-b2')) // failing -> running
    await user.click(screen.getByTestId('nav-stats'))
    // now 3 passing / 3 finished = 100%
    expect(screen.getByTestId('stat-success-rate-value')).toHaveTextContent('100')
    expect(screen.getByTestId('stat-running-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-failing-value')).toHaveTextContent('0')
  })

  it('reflects theme on the root and persists across navigation', async () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
