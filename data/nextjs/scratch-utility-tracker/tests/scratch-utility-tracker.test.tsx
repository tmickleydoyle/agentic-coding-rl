import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Utility Tracker', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /utility tracker/i })).toBeInTheDocument()
  })

  it('shows 6 seed bill rows', () => {
    render(<App />)
    expect(screen.getAllByTestId('bill-row')).toHaveLength(6)
  })

  it('shows correct unpaid total', () => {
    render(<App />)
    // unpaid: Water Jan $45 + Gas Feb $55 = $100
    expect(screen.getByTestId('total-unpaid').textContent).toBe('Unpaid Total: $100')
  })

  it('shows correct all bills total', () => {
    render(<App />)
    // 85+60+45+90+55+42 = 377
    expect(screen.getByTestId('total-all').textContent).toBe('All Bills Total: $377')
  })

  it('shows bill count', () => {
    render(<App />)
    expect(screen.getByTestId('bill-count').textContent).toBe('Bills: 6')
  })

  it('month filter shows only matching rows', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by month/i), 'Jan 2024')
    expect(screen.getAllByTestId('bill-row')).toHaveLength(3)
  })

  it('mark paid button disabled for paid entries', () => {
    render(<App />)
    const rows = screen.getAllByTestId('bill-row')
    // first row is Jan Electric - paid=true, Mark Paid should be disabled
    const markPaidBtn = rows[0].querySelector('button')
    expect(markPaidBtn).toBeDisabled()
  })

  it('marks an unpaid entry as paid', async () => {
    const user = userEvent.setup()
    render(<App />)
    const rows = screen.getAllByTestId('bill-row')
    // row index 2 is Jan Water - unpaid
    const markPaidBtn = rows[2].querySelectorAll('button')[0]
    await user.click(markPaidBtn)
    expect(rows[2].textContent).toContain('Paid')
    // unpaid total should update: was 100, now 55
    expect(screen.getByTestId('total-unpaid').textContent).toBe('Unpaid Total: $55')
  })

  it('deletes a bill', async () => {
    const user = userEvent.setup()
    render(<App />)
    const rows = screen.getAllByTestId('bill-row')
    const deleteBtn = rows[0].querySelectorAll('button')[1]
    await user.click(deleteBtn)
    expect(screen.getAllByTestId('bill-row')).toHaveLength(5)
    expect(screen.getByTestId('bill-count').textContent).toBe('Bills: 5')
  })

  it('adds a new bill', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^month$/i), 'Mar 2024')
    await user.clear(screen.getByLabelText(/^amount$/i))
    await user.type(screen.getByLabelText(/^amount$/i), '70')
    await user.click(screen.getByRole('button', { name: /add bill/i }))
    expect(screen.getAllByTestId('bill-row')).toHaveLength(7)
    expect(screen.getByTestId('bill-count').textContent).toBe('Bills: 7')
  })

  it('does not add bill with empty month', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^amount$/i), '70')
    await user.click(screen.getByRole('button', { name: /add bill/i }))
    expect(screen.getAllByTestId('bill-row')).toHaveLength(6)
  })

  it('does not add bill with amount 0', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^month$/i), 'Mar 2024')
    await user.click(screen.getByRole('button', { name: /add bill/i }))
    expect(screen.getAllByTestId('bill-row')).toHaveLength(6)
  })

  it('summary totals unaffected by month filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by month/i), 'Jan 2024')
    expect(screen.getByTestId('total-all').textContent).toBe('All Bills Total: $377')
    expect(screen.getByTestId('bill-count').textContent).toBe('Bills: 6')
  })
})
