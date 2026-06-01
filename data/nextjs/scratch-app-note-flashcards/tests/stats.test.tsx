import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('stats', () => {
  it('shows per-deck known/total from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-d1-known')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-d1-total')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-d2-known')).toHaveTextContent('0')
    expect(screen.getByTestId('stat-d2-total')).toHaveTextContent('2')
  })

  it('resetting a deck sets its known count back to zero', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-d1-known')).toHaveTextContent('1')
    await user.click(screen.getByTestId('reset-d1'))
    expect(screen.getByTestId('stat-d1-known')).toHaveTextContent('0')
  })

  it('marking a card known in study reflects on the stats page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('study-d2'))
    await user.click(screen.getByTestId('mark-known'))
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-d2-known')).toHaveTextContent('1')
  })
})
