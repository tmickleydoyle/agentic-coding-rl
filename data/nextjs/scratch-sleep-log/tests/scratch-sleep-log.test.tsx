import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Sleep Log', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Sleep Log')).toBeInTheDocument()
  })

  it('shows 3 seed records', () => {
    expect(screen.getAllByTestId('sleep-record')).toHaveLength(3)
  })

  it('shows correct average for seed data', () => {
    // (8.0 + 6.0 + 8.0) / 3 = 7.3
    expect(screen.getByTestId('avg-sleep').textContent).toBe('Avg: 7.3 hrs')
  })

  it('seed records contain date and quality info', () => {
    const records = screen.getAllByTestId('sleep-record')
    expect(records[0].textContent).toContain('2024-01-15')
    expect(records[0].textContent).toContain('Good')
  })

  it('adds a new sleep record', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Date$/i), '2024-01-18')
    await user.type(screen.getByLabelText(/^Bedtime$/i), '22:30')
    await user.type(screen.getByLabelText(/wake time/i), '06:30')
    await user.selectOptions(screen.getByLabelText(/quality/i), 'Poor')
    await user.click(screen.getByRole('button', { name: /add record/i }))
    expect(screen.getAllByTestId('sleep-record')).toHaveLength(4)
  })

  it('updates average after adding record', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Date$/i), '2024-01-18')
    await user.type(screen.getByLabelText(/^Bedtime$/i), '23:00')
    await user.type(screen.getByLabelText(/wake time/i), '07:00')
    await user.click(screen.getByRole('button', { name: /add record/i }))
    // (8+6+8+8)/4 = 7.5
    expect(screen.getByTestId('avg-sleep').textContent).toBe('Avg: 7.5 hrs')
  })

  it('does not add record when date is missing', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Bedtime$/i), '22:00')
    await user.type(screen.getByLabelText(/wake time/i), '06:00')
    await user.click(screen.getByRole('button', { name: /add record/i }))
    expect(screen.getAllByTestId('sleep-record')).toHaveLength(3)
  })

  it('calculates overnight sleep correctly (after midnight bedtime)', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Date$/i), '2024-01-19')
    await user.type(screen.getByLabelText(/^Bedtime$/i), '01:00')
    await user.type(screen.getByLabelText(/wake time/i), '09:00')
    await user.click(screen.getByRole('button', { name: /add record/i }))
    const records = screen.getAllByTestId('sleep-record')
    const last = records[records.length - 1]
    expect(last.textContent).toContain('8.0 hrs')
  })

  it('clears all records', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryAllByTestId('sleep-record')).toHaveLength(0)
  })

  it('shows 0.0 avg after clearing', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.getByTestId('avg-sleep').textContent).toBe('Avg: 0.0 hrs')
  })

  it('new record shows quality in the list', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Date$/i), '2024-01-20')
    await user.type(screen.getByLabelText(/^Bedtime$/i), '22:00')
    await user.type(screen.getByLabelText(/wake time/i), '06:00')
    await user.selectOptions(screen.getByLabelText(/quality/i), 'Poor')
    await user.click(screen.getByRole('button', { name: /add record/i }))
    const records = screen.getAllByTestId('sleep-record')
    expect(records[records.length - 1].textContent).toContain('Poor')
  })
})
