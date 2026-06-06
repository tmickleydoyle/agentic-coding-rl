import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Cron Explainer', () => {
  it('renders heading and input', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /cron explainer/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/cron expression/i)).toBeInTheDocument()
  })

  it('seeds input with default cron', () => {
    render(<App />)
    const input = screen.getByLabelText(/cron expression/i) as HTMLInputElement
    expect(input.value).toBe('0 9 * * 1-5')
  })

  it('does not show results before clicking Explain', () => {
    render(<App />)
    expect(screen.queryByTestId('results')).not.toBeInTheDocument()
  })

  it('explains seed expression and shows field breakdown', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /explain/i }))
    expect(screen.getByTestId('results')).toBeInTheDocument()
    expect(screen.getByTestId('field-minute').textContent).toBe('0')
    expect(screen.getByTestId('field-hour').textContent).toBe('9')
    expect(screen.getByTestId('field-dom').textContent).toBe('*')
    expect(screen.getByTestId('field-month').textContent).toBe('*')
    expect(screen.getByTestId('field-dow').textContent).toBe('1-5')
  })

  it('shows correct human-readable summary for seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /explain/i }))
    expect(screen.getByTestId('cron-summary').textContent).toBe(
      'at minute 0, at hour 9, every day, every month, weekdays 1 to 5'
    )
  })

  it('shows error for fewer than 5 fields', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/cron expression/i))
    await user.type(screen.getByLabelText(/cron expression/i), '* * *')
    await user.click(screen.getByRole('button', { name: /explain/i }))
    expect(screen.getByTestId('cron-error').textContent).toBe(
      'Invalid cron expression (need 5 fields)'
    )
    expect(screen.queryByTestId('field-minute')).not.toBeInTheDocument()
  })

  it('shows error for more than 5 fields', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/cron expression/i))
    await user.type(screen.getByLabelText(/cron expression/i), '* * * * * *')
    await user.click(screen.getByRole('button', { name: /explain/i }))
    expect(screen.getByTestId('cron-error')).toBeInTheDocument()
  })

  it('reset hides results and restores seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /explain/i }))
    expect(screen.getByTestId('results')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.queryByTestId('results')).not.toBeInTheDocument()
    const input = screen.getByLabelText(/cron expression/i) as HTMLInputElement
    expect(input.value).toBe('0 9 * * 1-5')
  })

  it('explains every-minute expression', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/cron expression/i))
    await user.type(screen.getByLabelText(/cron expression/i), '* * * * *')
    await user.click(screen.getByRole('button', { name: /explain/i }))
    const summary = screen.getByTestId('cron-summary').textContent ?? ''
    expect(summary).toContain('every minute')
    expect(summary).toContain('every hour')
    expect(summary).toContain('every day of the week')
  })

  it('explains step expression */15', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/cron expression/i))
    await user.type(screen.getByLabelText(/cron expression/i), '*/15 * * * *')
    await user.click(screen.getByRole('button', { name: /explain/i }))
    const summary = screen.getByTestId('cron-summary').textContent ?? ''
    expect(summary).toContain('every 15 minutes')
  })

  it('explains specific numbers', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/cron expression/i))
    await user.type(screen.getByLabelText(/cron expression/i), '30 14 1 6 0')
    await user.click(screen.getByRole('button', { name: /explain/i }))
    const summary = screen.getByTestId('cron-summary').textContent ?? ''
    expect(summary).toContain('at minute 30')
    expect(summary).toContain('at hour 14')
    expect(summary).toContain('on day 1')
    expect(summary).toContain('in month 6')
    expect(summary).toContain('on weekday 0')
  })

  it('updates results when re-explaining', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /explain/i }))
    expect(screen.getByTestId('field-hour').textContent).toBe('9')
    await user.clear(screen.getByLabelText(/cron expression/i))
    await user.type(screen.getByLabelText(/cron expression/i), '0 12 * * *')
    await user.click(screen.getByRole('button', { name: /explain/i }))
    expect(screen.getByTestId('field-hour').textContent).toBe('12')
  })
})
