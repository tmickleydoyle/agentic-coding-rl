import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAppt(u: U, customer: string, service: string, status: string) {
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

  it('shows Showing: 0 on empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
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

  it('navigates back to Appointments view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
  })

  it('adds an appointment with booked status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('ignores an appointment with blank customer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service'), 'Massage')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('ignores an appointment with blank service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer'), 'Bob')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('adds multiple appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await addAppt(u, 'Carol', 'Facial', 'no-show')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('deletes an appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('filters by booked status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('filters by done status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await addAppt(u, 'Carol', 'Facial', 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('filters by no-show status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Dave', 'Nails', 'no-show')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'no-show')
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('filter all shows everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('Summary shows Total: 0 and Done rate: 0% when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done rate: 0%')).toBeInTheDocument()
  })

  it('Summary reflects appointments added on Appointments view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await addAppt(u, 'Carol', 'Facial', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('No-show: 0')).toBeInTheDocument()
    expect(screen.getByText('Done rate: 67%')).toBeInTheDocument()
  })

  it('Summary Done rate is 100% when all are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'done')
    await addAppt(u, 'Bob', 'Massage', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Done rate: 100%')).toBeInTheDocument()
  })

  it('Summary updates after a deletion (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'done')
    await addAppt(u, 'Bob', 'Massage', 'booked')
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Done rate: 0%')).toBeInTheDocument()
  })

  it('appointments persist when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut', 'booked')
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('theme toggles to dark and is stored as data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Appointments')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })
})
