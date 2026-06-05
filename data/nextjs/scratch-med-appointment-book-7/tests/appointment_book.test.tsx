import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAppointment(u: U, customer: string, service: string, status: string) {
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
    expect(screen.getByRole('heading', { name: /appointments/i })).toBeInTheDocument()
  })

  it('shows seeded appointments on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('heading shows count of all appointments on load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Appointments (3)' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /appointments/i })).toBeInTheDocument()
  })

  it('adds a new appointment and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppointment(u, 'Dave', 'Manicure', 'booked')
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Appointments (4)' })).toBeInTheDocument()
  })

  it('ignores blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Customer'))
    await u.type(screen.getByLabelText('Service'), 'Haircut')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByRole('heading', { name: 'Appointments (3)' })).toBeInTheDocument()
  })

  it('ignores blank service name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer'), 'Eve')
    await u.clear(screen.getByLabelText('Service'))
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByRole('heading', { name: 'Appointments (3)' })).toBeInTheDocument()
  })

  it('deletes an appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Appointments (2)' })).toBeInTheDocument()
  })

  it('filters by booked status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
  })

  it('filters by done status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
  })

  it('filters by no-show status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'no-show')
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
  })

  it('filter all restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByRole('heading', { name: 'Appointments (3)' })).toBeInTheDocument()
  })

  it('summary shows seeded counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('No-show: 1')).toBeInTheDocument()
  })

  it('summary completion is 33% with one done of three', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('summary updates when new done appointment is added (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppointment(u, 'Dave', 'Wax', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('summary filter does NOT affect summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('delete affects summary total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('appointments state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppointment(u, 'Eve', 'Pedicure', 'booked')
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByText('Eve')).toBeInTheDocument()
  })
})
