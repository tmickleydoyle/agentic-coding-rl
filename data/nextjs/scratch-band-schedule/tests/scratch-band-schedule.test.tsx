import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Band Schedule', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Band Schedule')).toBeTruthy()
  })

  it('shows 4 seed rehearsals', () => {
    expect(screen.getByTestId('stat-total').textContent).toBe('4')
  })

  it('shows rehearsal items', () => {
    expect(screen.getByTestId('rehearsal-item-1')).toBeTruthy()
    expect(screen.getByTestId('rehearsal-item-4')).toBeTruthy()
  })

  it('displays attendees as comma-separated string', () => {
    const attendees = screen.getByTestId('attendees-1')
    expect(attendees.textContent).toContain('Alice')
    expect(attendees.textContent).toContain('Bob')
  })

  it('shows unique attendee count', () => {
    // Alice, Bob, Carol, Dave = 4 unique
    expect(screen.getByTestId('stat-unique-attendees').textContent).toBe('4')
  })

  it('shows rehearsal location', () => {
    expect(within(screen.getByTestId('rehearsal-item-1')).getByTestId('rehearsal-location-1').textContent).toBe('Studio A')
  })

  it('deletes a rehearsal', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-2'))
    expect(screen.queryByTestId('rehearsal-item-2')).toBeNull()
    expect(screen.getByTestId('stat-total').textContent).toBe('3')
  })

  it('adds a new rehearsal', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Extra Rehearsal')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-02-25' } })
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('stat-total').textContent).toBe('5')
  })

  it('does not add rehearsal with empty title', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-03-01' } })
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('stat-total').textContent).toBe('4')
  })

  it('does not add rehearsal with empty date', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'No Date')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('stat-total').textContent).toBe('4')
  })

  it('filters by location', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-location'), 'Studio A')
    expect(screen.getByTestId('rehearsal-item-1')).toBeTruthy()
    expect(screen.getByTestId('rehearsal-item-3')).toBeTruthy()
    expect(screen.queryByTestId('rehearsal-item-2')).toBeNull()
  })

  it('filter does not affect stats', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-location'), 'Studio A')
    expect(screen.getByTestId('stat-total').textContent).toBe('4')
  })

  it('parses comma-separated attendees on add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Test Rehearsal')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-03-10' } })
    await user.type(screen.getByTestId('input-attendees'), 'Eve, Frank')
    await user.click(screen.getByTestId('btn-add'))
    // Unique attendees: Alice, Bob, Carol, Dave, Eve, Frank = 6
    expect(screen.getByTestId('stat-unique-attendees').textContent).toBe('6')
  })
})
