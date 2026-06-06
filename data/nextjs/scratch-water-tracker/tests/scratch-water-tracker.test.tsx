import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Water Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Water Tracker')).toBeInTheDocument()
  })

  it('shows seed data entries', () => {
    const entries = screen.getAllByTestId('log-entry')
    expect(entries).toHaveLength(3)
  })

  it('shows correct initial total', () => {
    expect(screen.getByTestId('total-intake').textContent).toBe('1080 ml')
  })

  it('shows daily goal', () => {
    expect(screen.getByTestId('daily-goal').textContent).toBe('Goal: 2000 ml')
  })

  it('does not show goal-reached initially', () => {
    expect(screen.queryByTestId('goal-reached')).not.toBeInTheDocument()
  })

  it('logs a new water entry', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByLabelText(/amount/i))
    await user.type(screen.getByLabelText(/amount/i), '400')
    await user.type(screen.getByLabelText(/time/i), '14:00')
    await user.click(screen.getByRole('button', { name: /log water/i }))
    expect(screen.getAllByTestId('log-entry')).toHaveLength(4)
  })

  it('updates total after logging', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/amount/i), '200')
    await user.type(screen.getByLabelText(/time/i), '10:00')
    await user.click(screen.getByRole('button', { name: /log water/i }))
    expect(screen.getByTestId('total-intake').textContent).toBe('1280 ml')
  })

  it('clears inputs after logging', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/amount/i), '300')
    await user.type(screen.getByLabelText(/time/i), '09:00')
    await user.click(screen.getByRole('button', { name: /log water/i }))
    expect((screen.getByLabelText(/amount/i) as HTMLInputElement).value).toBe('')
  })

  it('rejects log with empty amount', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/time/i), '09:00')
    await user.click(screen.getByRole('button', { name: /log water/i }))
    expect(screen.getAllByTestId('log-entry')).toHaveLength(3)
  })

  it('rejects log with zero amount', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/amount/i), '0')
    await user.type(screen.getByLabelText(/time/i), '09:00')
    await user.click(screen.getByRole('button', { name: /log water/i }))
    expect(screen.getAllByTestId('log-entry')).toHaveLength(3)
  })

  it('shows goal-reached when total >= 2000', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/amount/i), '1000')
    await user.type(screen.getByLabelText(/time/i), '20:00')
    await user.click(screen.getByRole('button', { name: /log water/i }))
    // total = 1080 + 1000 = 2080
    expect(screen.getByTestId('goal-reached')).toBeInTheDocument()
  })

  it('resets day', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /reset day/i }))
    expect(screen.queryAllByTestId('log-entry')).toHaveLength(0)
    expect(screen.getByTestId('total-intake').textContent).toBe('0 ml')
  })

  it('progress bar does not exceed 100', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/amount/i), '5000')
    await user.type(screen.getByLabelText(/time/i), '23:00')
    await user.click(screen.getByRole('button', { name: /log water/i }))
    const bar = screen.getByTestId('progress-bar') as HTMLProgressElement
    expect(Number(bar.value)).toBeLessThanOrEqual(100)
  })
})
