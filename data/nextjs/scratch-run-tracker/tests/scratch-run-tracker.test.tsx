import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Run Tracker', () => {
  it('shows 3 seed runs', () => {
    render(<App />)
    expect(screen.getAllByTestId('run-item')).toHaveLength(3)
  })

  it('shows seed distances', () => {
    render(<App />)
    const dists = screen.getAllByTestId('run-distance').map(el => el.textContent)
    expect(dists).toContain('3.1 mi')
    expect(dists).toContain('6.2 mi')
    expect(dists).toContain('2 mi')
  })

  it('shows seed durations', () => {
    render(<App />)
    const durs = screen.getAllByTestId('run-duration').map(el => el.textContent)
    expect(durs).toContain('28 min')
    expect(durs).toContain('58 min')
    expect(durs).toContain('20 min')
  })

  it('shows correct total runs', () => {
    render(<App />)
    expect(screen.getByTestId('total-runs').textContent).toBe('Runs: 3')
  })

  it('shows correct total distance', () => {
    render(<App />)
    expect(screen.getByTestId('total-distance').textContent).toBe('Distance: 11.3 mi')
  })

  it('shows pace for a run', () => {
    render(<App />)
    // 28 min / 3.1 mi = 9.032 min/mi → 541 seconds total → 9:01
    const paces = screen.getAllByTestId('run-pace').map(el => el.textContent)
    expect(paces).toContain('9:01 /mi')
  })

  it('log button disabled when distance/duration are empty', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /log run/i })).toBeDisabled()
  })

  it('logs a new run', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/distance \(miles\)/i))
    await user.type(screen.getByLabelText(/distance \(miles\)/i), '5')
    await user.clear(screen.getByLabelText(/duration \(minutes\)/i))
    await user.type(screen.getByLabelText(/duration \(minutes\)/i), '45')
    await user.click(screen.getByRole('button', { name: /log run/i }))
    expect(screen.getAllByTestId('run-item')).toHaveLength(4)
    expect(screen.getByTestId('total-runs').textContent).toBe('Runs: 4')
  })

  it('clears distance and duration after logging', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/distance \(miles\)/i))
    await user.type(screen.getByLabelText(/distance \(miles\)/i), '4')
    await user.clear(screen.getByLabelText(/duration \(minutes\)/i))
    await user.type(screen.getByLabelText(/duration \(minutes\)/i), '36')
    await user.click(screen.getByRole('button', { name: /log run/i }))
    expect(screen.getByLabelText(/distance \(miles\)/i)).toHaveValue(null)
    expect(screen.getByLabelText(/duration \(minutes\)/i)).toHaveValue(null)
  })

  it('deletes a run', async () => {
    const user = userEvent.setup()
    render(<App />)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('run-item')).toHaveLength(2)
  })

  it('shows empty message when all runs deleted', async () => {
    const user = userEvent.setup()
    render(<App />)
    const getDeletes = () => screen.queryAllByRole('button', { name: /delete/i })
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    expect(screen.getByTestId('empty-message')).toBeInTheDocument()
  })

  it('shows avg pace as dash when no runs', async () => {
    const user = userEvent.setup()
    render(<App />)
    const getDeletes = () => screen.queryAllByRole('button', { name: /delete/i })
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    expect(screen.getByTestId('avg-pace').textContent).toBe('Avg pace: —')
  })

  it('runs are sorted most recent date first', () => {
    render(<App />)
    const dates = screen.getAllByTestId('run-date').map(el => el.textContent)
    expect(dates[0]).toBe('2024-03-08')
  })
})
