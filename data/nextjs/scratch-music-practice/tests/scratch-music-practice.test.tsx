import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Music Practice Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Music Practice Tracker')).toBeTruthy()
  })

  it('shows seed sessions', () => {
    expect(screen.getByTestId('session-item-1')).toBeTruthy()
    expect(screen.getByTestId('session-item-5')).toBeTruthy()
  })

  it('shows correct initial total sessions stat', () => {
    expect(screen.getByTestId('stat-total-sessions').textContent).toBe('5')
  })

  it('shows correct initial total minutes stat', () => {
    expect(screen.getByTestId('stat-total-minutes').textContent).toBe('205')
  })

  it('shows top instrument', () => {
    // Guitar: 45+60=105, Piano: 30+50=80, Drums: 20 → Guitar is top
    expect(screen.getByTestId('stat-top-instrument').textContent).toBe('Guitar')
  })

  it('displays duration with min suffix', () => {
    const item = screen.getByTestId('session-item-1')
    expect(within(item).getByTestId('session-duration-1').textContent).toContain('min')
  })

  it('adds a new session and updates stats', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-instrument'), 'Violin')
    await user.type(screen.getByTestId('input-duration'), '25')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('stat-total-sessions').textContent).toBe('6')
    expect(screen.getByTestId('stat-total-minutes').textContent).toBe('230')
  })

  it('does not add session when instrument is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-duration'), '30')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('stat-total-sessions').textContent).toBe('5')
  })

  it('does not add session when duration is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-instrument'), 'Violin')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('stat-total-sessions').textContent).toBe('5')
  })

  it('deletes a session', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    expect(screen.queryByTestId('session-item-1')).toBeNull()
    expect(screen.getByTestId('stat-total-sessions').textContent).toBe('4')
  })

  it('filter by instrument hides non-matching sessions', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-filter'), 'Piano')
    expect(screen.getByTestId('session-item-2')).toBeTruthy()
    expect(screen.getByTestId('session-item-5')).toBeTruthy()
    expect(screen.queryByTestId('session-item-1')).toBeNull()
  })

  it('filter does not affect stats', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-filter'), 'Drums')
    expect(screen.getByTestId('stat-total-sessions').textContent).toBe('5')
  })

  it('deleting all sessions shows None for top instrument', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    await user.click(screen.getByTestId('delete-btn-2'))
    await user.click(screen.getByTestId('delete-btn-3'))
    await user.click(screen.getByTestId('delete-btn-4'))
    await user.click(screen.getByTestId('delete-btn-5'))
    expect(screen.getByTestId('stat-top-instrument').textContent).toBe('None')
    expect(screen.getByTestId('stat-total-minutes').textContent).toBe('0')
  })
})
