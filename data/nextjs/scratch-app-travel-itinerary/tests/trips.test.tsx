import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('trips list and detail', () => {
  it('lists seeded trips with their total cost', () => {
    render(<App />)
    const list = screen.getByTestId('trip-list')
    expect(within(list).getByText('Japan Spring')).toBeInTheDocument()
    // tr1 = 0 + 60 + 120 = 180
    expect(screen.getByTestId('trip-tr1-cost')).toHaveTextContent('180')
    // tr2 = 25
    expect(screen.getByTestId('trip-tr2-cost')).toHaveTextContent('25')
  })

  it('opens a trip and shows day-grouped activities', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    expect(screen.getByTestId('page-trip-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Japan Spring')
    expect(screen.getByTestId('detail-total')).toHaveTextContent('180')
    // day 1 has a1 + a2
    const day1 = screen.getByTestId('day-1-list')
    expect(within(day1).getByTestId('activity-a1')).toBeInTheDocument()
    expect(within(day1).getByTestId('activity-a2')).toBeInTheDocument()
    // day 3 has nothing planned
    expect(screen.getByTestId('day-3-empty')).toBeInTheDocument()
  })

  it('shows per-day cost totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    expect(screen.getByTestId('day-1-cost')).toHaveTextContent('60')
    expect(screen.getByTestId('day-2-cost')).toHaveTextContent('120')
  })

  it('reorders an activity up within its day group', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    const before = screen
      .getByTestId('day-1-list')
      .querySelectorAll('li[data-testid^="activity-"]')
    expect(before[0].getAttribute('data-testid')).toBe('activity-a1')
    expect(before[1].getAttribute('data-testid')).toBe('activity-a2')
    await user.click(screen.getByTestId('up-a2'))
    const after = screen
      .getByTestId('day-1-list')
      .querySelectorAll('li[data-testid^="activity-"]')
    expect(after[0].getAttribute('data-testid')).toBe('activity-a2')
    expect(after[1].getAttribute('data-testid')).toBe('activity-a1')
  })

  it('disables up on the first activity and down on the last', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    expect(screen.getByTestId('up-a1')).toBeDisabled()
    expect(screen.getByTestId('down-a2')).toBeDisabled()
  })

  it('removes an activity and the trip total drops', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    await user.click(screen.getByTestId('remove-a3'))
    expect(screen.queryByTestId('activity-a3')).not.toBeInTheDocument()
    expect(screen.getByTestId('detail-total')).toHaveTextContent('60')
  })
})
