import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('history and insights', () => {
  it('lists seeded entries most-recent-first', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    const rows = screen.getByTestId('entry-list').querySelectorAll('li')
    expect(rows[0].getAttribute('data-testid')).toBe('entry-m3') // 05-27
    expect(rows[2].getAttribute('data-testid')).toBe('entry-m1') // 05-25
  })

  it('shows each entry score and joined triggers', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('entry-m2-score')).toHaveTextContent('2')
    expect(screen.getByTestId('entry-m2-triggers')).toHaveTextContent('work, stress')
  })

  it('removes an entry from history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('remove-m2'))
    expect(screen.queryByTestId('entry-m2')).not.toBeInTheDocument()
  })

  it('computes seed insights: average, best, top, trend, count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-insights'))
    expect(screen.getByTestId('stat-average-value')).toHaveTextContent('3.7')
    expect(screen.getByTestId('stat-best-value')).toHaveTextContent('5')
    expect(screen.getByTestId('stat-top-value')).toHaveTextContent('exercise')
    expect(screen.getByTestId('stat-trend-value')).toHaveTextContent('up')
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('3')
  })

  it('removing the high-mood day lowers the average and changes the best', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('remove-m3'))
    await user.click(screen.getByTestId('nav-insights'))
    // remaining 4, 2 => average 3
    expect(screen.getByTestId('stat-average-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-best-value')).toHaveTextContent('4')
  })

  it('shows a flat trend and empty insights when all entries are removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('remove-m1'))
    await user.click(screen.getByTestId('remove-m2'))
    await user.click(screen.getByTestId('remove-m3'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-insights'))
    expect(screen.getByTestId('stat-average-value')).toHaveTextContent('0')
    expect(screen.getByTestId('stat-best-value')).toHaveTextContent('-')
    expect(screen.getByTestId('stat-top-value')).toHaveTextContent('-')
    expect(screen.getByTestId('stat-trend-value')).toHaveTextContent('flat')
  })

  it('a newly logged high score becomes the best entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('remove-m3'))
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('score-input'), '5')
    await user.click(screen.getByTestId('submit-mood'))
    await user.click(screen.getByTestId('nav-insights'))
    expect(screen.getByTestId('stat-best-value')).toHaveTextContent('5')
  })
})
