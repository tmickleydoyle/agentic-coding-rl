import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function apptRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

async function addAppt(u: U, customer: string, service: string) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
  await u.clear(screen.getByLabelText(/service/i))
  await u.type(screen.getByLabelText(/service/i), service)
  await u.click(screen.getByRole('button', { name: /add appointment/i }))
}

describe('Appointment Book app', () => {
  it('starts on the Appointments view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
  })

  it('shows the three seeded appointments on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows Showing: 3 appointments for All filter by default', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 appointments')).toBeInTheDocument()
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

  it('adds a new appointment with booked status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Diana', 'Pedicure')
    expect(screen.getByText('Diana')).toBeInTheDocument()
    expect(screen.getByText('Pedicure')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 appointments')).toBeInTheDocument()
    const row = apptRow('Diana')
    expect(within(row).getByText('booked')).toBeInTheDocument()
  })

  it('ignores a new appointment when customer name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/customer name/i))
    await u.type(screen.getByLabelText(/service/i), 'Haircut')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 3 appointments')).toBeInTheDocument()
  })

  it('ignores a new appointment when service is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/customer name/i), 'Dave')
    await u.clear(screen.getByLabelText(/service/i))
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 3 appointments')).toBeInTheDocument()
  })

  it('marks an appointment as done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark alice done/i }))
    expect(within(apptRow('Alice')).getByText('done')).toBeInTheDocument()
  })

  it('mark done button is disabled when already done', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /mark bob done/i })).toBeDisabled()
  })

  it('marks an appointment as no-show', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark alice no-show/i }))
    expect(within(apptRow('Alice')).getByText('no-show')).toBeInTheDocument()
  })

  it('mark no-show button is disabled when already no-show', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /mark carol no-show/i })).toBeDisabled()
  })

  it('deletes an appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 appointments')).toBeInTheDocument()
  })

  it('filters by Booked status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Booked' }))
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('filters by Done status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('filters by No-show status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'No-show' }))
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('shows Summary stats matching seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('No-show: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion rate: 33%')).toBeInTheDocument()
  })

  it('Summary updates after marking an appointment done (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark alice done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Booked: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion rate: 67%')).toBeInTheDocument()
  })

  it('Summary updates after deleting an appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion rate: 0%')).toBeInTheDocument()
  })

  it('toggles theme in Settings and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Appointments')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('appointment state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Eve', 'Waxing')
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByText('Eve')).toBeInTheDocument()
  })
})
