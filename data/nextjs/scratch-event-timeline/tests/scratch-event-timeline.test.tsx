import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Event Timeline', () => {
  beforeEach(() => render(<App />))

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /event timeline/i })).toBeInTheDocument()
  })

  it('shows 5 seed event cards', () => {
    expect(screen.getAllByTestId('event-card')).toHaveLength(5)
  })

  it('shows event count = 5 events', () => {
    expect(screen.getByTestId('event-count').textContent).toContain('5')
  })

  it('shows seed event titles', () => {
    expect(screen.getByText('Project Kickoff')).toBeInTheDocument()
    expect(screen.getByText('Public Launch')).toBeInTheDocument()
  })

  it('shows event dates in YYYY-MM-DD format', () => {
    const dates = screen.getAllByTestId('event-date')
    expect(dates[0].textContent).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('shows events in chronological order', () => {
    const dates = screen.getAllByTestId('event-date').map(el => el.textContent ?? '')
    const sorted = [...dates].sort()
    expect(dates).toEqual(sorted)
  })

  it('deletes an event', async () => {
    const user = userEvent.setup()
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('event-card')).toHaveLength(4)
    expect(screen.getByTestId('event-count').textContent).toContain('4')
  })

  it('adds a new event', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/event date/i), '2024-06-15')
    await user.type(screen.getByLabelText(/event title/i), 'Mid-Year Review')
    await user.type(screen.getByLabelText(/event description/i), 'Reviewed progress')
    await user.click(screen.getByRole('button', { name: /add event/i }))
    expect(screen.getAllByTestId('event-card')).toHaveLength(6)
    expect(screen.getByText('Mid-Year Review')).toBeInTheDocument()
  })

  it('inserts new event in chronological order', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/event date/i), '2024-02-01')
    await user.type(screen.getByLabelText(/event title/i), 'Early Event')
    await user.type(screen.getByLabelText(/event description/i), 'Very early')
    await user.click(screen.getByRole('button', { name: /add event/i }))
    const dates = screen.getAllByTestId('event-date').map(el => el.textContent ?? '')
    const sorted = [...dates].sort()
    expect(dates).toEqual(sorted)
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    const titleInput = screen.getByLabelText(/event title/i)
    await user.type(screen.getByLabelText(/event date/i), '2025-01-01')
    await user.type(titleInput, 'New Year')
    await user.type(screen.getByLabelText(/event description/i), 'Happy new year')
    await user.click(screen.getByRole('button', { name: /add event/i }))
    expect(titleInput).toHaveValue('')
  })

  it('does not add event with empty title', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/event date/i), '2025-01-01')
    await user.type(screen.getByLabelText(/event description/i), 'Some desc')
    await user.click(screen.getByRole('button', { name: /add event/i }))
    expect(screen.getAllByTestId('event-card')).toHaveLength(5)
  })

  it('shows event descriptions', () => {
    const descs = screen.getAllByTestId('event-description')
    expect(descs.length).toBe(5)
    expect(descs[0].textContent).toBeTruthy()
  })
})
