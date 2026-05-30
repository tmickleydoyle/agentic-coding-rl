import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today and history', () => {
  it('shows only today entries on the today page', () => {
    render(<App />)
    const list = screen.getByTestId('today-list')
    expect(within(list).getByTestId('entry-e3')).toBeInTheDocument()
    expect(within(list).queryByTestId('entry-e1')).not.toBeInTheDocument()
  })

  it('shows todays blocker count', () => {
    render(<App />)
    // only e3 is today and it has no blocker
    expect(screen.getByTestId('today-blocker-count')).toHaveTextContent('0')
  })

  it('shows entry member name and content', () => {
    render(<App />)
    expect(screen.getByTestId('entry-e3-member')).toHaveTextContent('Ada')
    expect(screen.getByTestId('entry-e3-today')).toHaveTextContent('Review PRs')
  })

  it('history defaults to today and shows its entries', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-count')).toHaveTextContent('1')
    expect(screen.getByTestId('entry-e3')).toBeInTheDocument()
  })

  it('history changes when selecting a different date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.selectOptions(screen.getByTestId('date-select'), '2026-05-28')
    expect(screen.getByTestId('history-count')).toHaveTextContent('2')
    expect(screen.getByTestId('entry-e1')).toBeInTheDocument()
    expect(screen.getByTestId('entry-e2')).toBeInTheDocument()
  })

  it('marks entries that have a blocker', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.selectOptions(screen.getByTestId('date-select'), '2026-05-28')
    expect(screen.getByTestId('entry-e1')).toHaveAttribute('data-has-blocker', 'true')
    expect(screen.getByTestId('entry-e1-blocker')).toHaveTextContent('Waiting on review')
    expect(screen.getByTestId('entry-e2')).toHaveAttribute('data-has-blocker', 'false')
    expect(screen.queryByTestId('entry-e2-blocker')).not.toBeInTheDocument()
  })

  it('shows per-member entry counts on the team page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-team'))
    expect(screen.getByTestId('team-member-m1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('team-member-m2-count')).toHaveTextContent('1')
    expect(screen.getByTestId('team-member-m3-count')).toHaveTextContent('0')
  })
})
