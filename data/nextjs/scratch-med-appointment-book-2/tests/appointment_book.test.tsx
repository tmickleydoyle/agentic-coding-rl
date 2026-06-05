import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAppt(u: U, customer: string, service: string, status: 'booked' | 'done' | 'no-show' = 'booked') {
  await u.clear(screen.getByLabelText('Customer'))
  await u.type(screen.getByLabelText('Customer'), customer)
  await u.clear(screen.getByLabelText('Service'))
  await u.type(screen.getByLabelText('Service'), service)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add appointment/i }))
}

describe('Appointment Book app', () => {
  it('starts on the Appointments view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
  })

  it('shows Showing: 0 appointments initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 appointments')).toBeInTheDocument()
  })

  it('adds a booked appointment and shows it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    expect(screen.getByText('Alice — Haircut — booked')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
  })

  it('ignores appointment with blank customer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service'), 'Massage')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 0 appointments')).toBeInTheDocument()
  })

  it('ignores appointment with blank service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer'), 'Bob')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 0 appointments')).toBeInTheDocument()
  })

  it('deletes an appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Carol', 'Facial', 'done')
    expect(screen.getByText('Carol — Facial — done')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    expect(screen.queryByText('Carol — Facial — done')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 appointments')).toBeInTheDocument()
  })

  it('filters by Booked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await u.click(screen.getByRole('button', { name: 'Booked' }))
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
    expect(screen.getByText('Alice — Haircut — booked')).toBeInTheDocument()
    expect(screen.queryByText('Bob — Massage — done')).not.toBeInTheDocument()
  })

  it('filters by Done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
    expect(screen.getByText('Bob — Massage — done')).toBeInTheDocument()
    expect(screen.queryByText('Alice — Haircut — booked')).not.toBeInTheDocument()
  })

  it('filters by No-show', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Dave', 'Waxing', 'no-show')
    await addAppt(u, 'Eve', 'Manicure', 'booked')
    await u.click(screen.getByRole('button', { name: 'No-show' }))
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
    expect(screen.getByText('Dave — Waxing — no-show')).toBeInTheDocument()
    expect(screen.queryByText('Eve — Manicure — booked')).not.toBeInTheDocument()
  })

  it('All filter shows all appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await u.click(screen.getByRole('button', { name: 'Done' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 2 appointments')).toBeInTheDocument()
  })

  it('Summary shows correct totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await addAppt(u, 'Dave', 'Waxing', 'no-show')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('No-show: 1')).toBeInTheDocument()
  })

  it('Summary shows 0% no-show rate with no appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('No-show rate: 0%')).toBeInTheDocument()
  })

  it('Summary computes no-show rate correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'no-show')
    await addAppt(u, 'Bob', 'Massage', 'booked')
    await addAppt(u, 'Carol', 'Facial', 'booked')
    await addAppt(u, 'Dave', 'Waxing', 'booked')
    await nav(u, 'Summary')
    expect(screen.getByText('No-show rate: 25%')).toBeInTheDocument()
  })

  it('delete updates Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Booked: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('appointments persist after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Frank', 'Pedicure', 'booked')
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByText('Frank — Pedicure — booked')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('adds a no-show appointment with correct label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Grace', 'Threading', 'no-show')
    expect(screen.getByText('Grace — Threading — no-show')).toBeInTheDocument()
  })
})
