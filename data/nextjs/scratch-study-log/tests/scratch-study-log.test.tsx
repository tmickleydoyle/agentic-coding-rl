import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Study Log', () => {
  beforeEach(() => render(<App />))

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /study log/i })).toBeInTheDocument()
  })

  it('shows 6 seed sessions', () => {
    expect(screen.getAllByTestId('session-item')).toHaveLength(6)
  })

  it('shows correct total sessions', () => {
    expect(screen.getByTestId('total-sessions').textContent).toBe('6')
  })

  it('shows correct total minutes (350)', () => {
    // 45+60+30+90+50+75 = 350
    expect(screen.getByTestId('total-minutes').textContent).toBe('350')
  })

  it('shows correct average rating', () => {
    // (4+5+3+5+3+4)/6 = 24/6 = 4.0
    expect(screen.getByTestId('avg-rating').textContent).toBe('4.0')
  })

  it('sessions are sorted most recent first', () => {
    const dates = screen.getAllByTestId('session-date').map(el => el.textContent!)
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] <= dates[i - 1]).toBe(true)
    }
  })

  it('shows 4 subject rows in summary', () => {
    expect(screen.getAllByTestId('subject-row')).toHaveLength(4)
  })

  it('subject rows are in alphabetical order', () => {
    const names = screen.getAllByTestId('subject-name').map(el => el.textContent!)
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).toEqual(sorted)
  })

  it('Math row shows correct stats', () => {
    const rows = screen.getAllByTestId('subject-row')
    const mathRow = rows.find(r => within(r).getByTestId('subject-name').textContent === 'Math')!
    expect(within(mathRow).getByTestId('subject-sessions').textContent).toBe('2')
    expect(within(mathRow).getByTestId('subject-minutes').textContent).toBe('135')
    // (4+5)/2 = 4.5
    expect(within(mathRow).getByTestId('subject-avg-rating').textContent).toBe('4.5')
  })

  it('deletes a session', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('session-item')
    await user.click(within(items[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getAllByTestId('session-item')).toHaveLength(5)
    expect(screen.getByTestId('total-sessions').textContent).toBe('5')
  })

  it('updates subject summary after delete', async () => {
    const user = userEvent.setup()
    // Delete History session (The Renaissance)
    const items = screen.getAllByTestId('session-item')
    const historyItem = items.find(i => within(i).getByTestId('session-subject').textContent === 'History')!
    await user.click(within(historyItem).getByRole('button', { name: /delete/i }))
    // History row should be gone
    const names = screen.getAllByTestId('subject-name').map(el => el.textContent)
    expect(names).not.toContain('History')
  })

  it('adds a new session', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^subject$/i), 'Art')
    await user.type(screen.getByLabelText(/^topic$/i), 'Watercolor')
    await user.type(screen.getByLabelText(/duration/i), '40')
    await user.type(screen.getByLabelText(/^rating$/i), '4')
    await user.click(screen.getByRole('button', { name: /log session/i }))
    expect(screen.getAllByTestId('session-item')).toHaveLength(7)
    expect(screen.getByTestId('total-sessions').textContent).toBe('7')
  })

  it('new session appears first in list', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^subject$/i), 'Physics')
    await user.type(screen.getByLabelText(/^topic$/i), 'Waves')
    await user.click(screen.getByRole('button', { name: /log session/i }))
    const firstItem = screen.getAllByTestId('session-item')[0]
    expect(within(firstItem).getByTestId('session-topic').textContent).toBe('Waves')
  })

  it('does not add session with empty subject', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^topic$/i), 'Something')
    await user.click(screen.getByRole('button', { name: /log session/i }))
    expect(screen.getAllByTestId('session-item')).toHaveLength(6)
  })

  it('clears form after adding session', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^subject$/i), 'Bio')
    await user.type(screen.getByLabelText(/^topic$/i), 'Cells')
    await user.click(screen.getByRole('button', { name: /log session/i }))
    expect(screen.getByLabelText(/^subject$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^topic$/i)).toHaveValue('')
  })
})
