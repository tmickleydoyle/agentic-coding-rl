import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAppt(u: U, customer: string, service: string, status?: string) {
  await u.clear(screen.getByLabelText('Customer'))
  await u.type(screen.getByLabelText('Customer'), customer)
  await u.clear(screen.getByLabelText('Service'))
  await u.type(screen.getByLabelText('Service'), service)
  if (status) {
    await u.selectOptions(screen.getByLabelText('Status'), status)
  }
  await u.click(screen.getByRole('button', { name: /add appointment/i }))
}

function apptRow(customer: string): HTMLElement {
  const el = screen.getByText(customer)
  const li = el.closest('li')
  if (!li) throw new Error(`no row for ${customer}`)
  return li as HTMLElement
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

  it('navigates back to Appointments view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
  })

  it('shows Showing: 0 of 0 on empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('adds an appointment with default status booked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('ignores blank customer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service'), 'Massage')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('ignores blank service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer'), 'Bob')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('adds appointment with done status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Carol', 'Manicure', 'done')
    expect(within(apptRow('Carol')).getByText('done')).toBeInTheDocument()
  })

  it('adds appointment with no-show status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Dave', 'Pedicure', 'no-show')
    expect(within(apptRow('Dave')).getByText('no-show')).toBeInTheDocument()
  })

  it('deletes an appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Eve', 'Waxing')
    await u.click(within(apptRow('Eve')).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('marks an appointment done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Frank', 'Coloring')
    expect(within(apptRow('Frank')).getByText('booked')).toBeInTheDocument()
    await u.click(within(apptRow('Frank')).getByRole('button', { name: /mark done/i }))
    expect(within(apptRow('Frank')).getByText('done')).toBeInTheDocument()
  })

  it('filter by booked shows only booked appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Grace', 'Trim', 'booked')
    await addAppt(u, 'Hank', 'Color', 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
    expect(screen.queryByText('Hank')).not.toBeInTheDocument()
  })

  it('filter by done shows only done appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Iris', 'Facial', 'done')
    await addAppt(u, 'Jake', 'Massage', 'booked')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Iris')).toBeInTheDocument()
    expect(screen.queryByText('Jake')).not.toBeInTheDocument()
  })

  it('filter by no-show works', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Karen', 'Nails', 'no-show')
    await addAppt(u, 'Leo', 'Trim', 'booked')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'no-show')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Karen')).toBeInTheDocument()
    expect(screen.queryByText('Leo')).not.toBeInTheDocument()
  })

  it('filter all shows everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Mia', 'Facial', 'done')
    await addAppt(u, 'Ned', 'Cut', 'booked')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('Summary shows correct stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Owen', 'Cut', 'booked')
    await addAppt(u, 'Pam', 'Color', 'done')
    await addAppt(u, 'Quinn', 'Trim', 'no-show')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('No-show: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary shows 0% when no appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary reflects mark done cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Rita', 'Wax', 'booked')
    await addAppt(u, 'Sam', 'Cut', 'booked')
    await u.click(within(apptRow('Rita')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('theme toggles and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    expect(screen.getByText('Theme: light')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByText('Theme: dark')).toBeInTheDocument()
    await nav(u, 'Appointments')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('appointments persist when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Tina', 'Blowout')
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByText('Tina')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('Summary total goes down after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Uma', 'Cut', 'booked')
    await addAppt(u, 'Vic', 'Color', 'done')
    await u.click(within(apptRow('Uma')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Booked: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })
})
