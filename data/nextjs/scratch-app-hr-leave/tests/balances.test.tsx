import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('balances and calendar', () => {
  it('shows allowance, used, and remaining per employee', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-balances'))
    // e1 has one approved request of 3 days; allowance 20 -> remaining 17
    expect(screen.getByTestId('balance-e1-allowance')).toHaveTextContent('20')
    expect(screen.getByTestId('balance-e1-used')).toHaveTextContent('3')
    expect(screen.getByTestId('balance-e1-remaining')).toHaveTextContent('17')
  })

  it('counts only approved requests against the balance', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-balances'))
    // e2 has only a pending request -> 0 used, allowance 25
    expect(screen.getByTestId('balance-e2-used')).toHaveTextContent('0')
    expect(screen.getByTestId('balance-e2-remaining')).toHaveTextContent('25')
  })

  it('updates the balance after approving a request', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('approve-r3'))
    await user.click(screen.getByTestId('nav-balances'))
    // e2 now has 5 approved days -> remaining 20
    expect(screen.getByTestId('balance-e2-used')).toHaveTextContent('5')
    expect(screen.getByTestId('balance-e2-remaining')).toHaveTextContent('20')
  })

  it('the calendar lists only approved requests', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-calendar'))
    expect(screen.getByTestId('calendar-count')).toHaveTextContent('1')
    expect(screen.getByTestId('calendar-entry-r1')).toBeInTheDocument()
    expect(screen.queryByTestId('calendar-entry-r2')).not.toBeInTheDocument()
  })

  it('a newly approved request appears in the calendar', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('approve-r2'))
    await user.click(screen.getByTestId('nav-calendar'))
    expect(screen.getByTestId('calendar-count')).toHaveTextContent('2')
    expect(screen.getByTestId('calendar-entry-r2')).toBeInTheDocument()
    expect(screen.getByTestId('calendar-entry-r2-employee')).toHaveTextContent('Ada')
  })

  it('calendar entries are sorted by day ascending', async () => {
    const user = userEvent.setup()
    render(<App />)
    // approve r3 (2026-06-05) so it appears alongside r1 (2026-06-01)
    await user.click(screen.getByTestId('approve-r3'))
    await user.click(screen.getByTestId('nav-calendar'))
    const list = screen.getByTestId('calendar-list')
    const ids = Array.from(list.querySelectorAll('li')).map((el) => el.getAttribute('data-testid'))
    expect(ids).toEqual(['calendar-entry-r1', 'calendar-entry-r3'])
  })
})
