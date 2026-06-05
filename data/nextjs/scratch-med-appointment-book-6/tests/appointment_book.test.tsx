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

  it('adds an appointment and updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('ignores appointment with blank customer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service'), 'Massage')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('ignores appointment with blank service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer'), 'Bob')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('marks an appointment as done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Carol', 'Manicure')
    await u.click(within(apptRow('Carol')).getByRole('button', { name: /mark done carol/i }))
    expect(within(apptRow('Carol')).getByText('done')).toBeInTheDocument()
  })

  it('Mark done button is disabled once already done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Dan', 'Wax', 'done')
    expect(within(apptRow('Dan')).getByRole('button', { name: /mark done dan/i })).toBeDisabled()
  })

  it('marks an appointment as no-show', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Eve', 'Facial')
    await u.click(within(apptRow('Eve')).getByRole('button', { name: /mark no-show eve/i }))
    expect(within(apptRow('Eve')).getByText('no-show')).toBeInTheDocument()
  })

  it('Mark no-show button is disabled once already no-show', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Frank', 'Tint', 'no-show')
    expect(within(apptRow('Frank')).getByRole('button', { name: /mark no-show frank/i })).toBeDisabled()
  })

  it('filters by Booked shows only booked appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Grace', 'Cut', 'booked')
    await addAppt(u, 'Hank', 'Color', 'done')
    await u.click(screen.getByRole('button', { name: 'Booked' }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
    expect(screen.queryByText('Hank')).not.toBeInTheDocument()
  })

  it('filters by Done shows only done appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Ivy', 'Trim', 'booked')
    await addAppt(u, 'Jack', 'Style', 'done')
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Jack')).toBeInTheDocument()
    expect(screen.queryByText('Ivy')).not.toBeInTheDocument()
  })

  it('filters by No-show shows only no-show appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Kim', 'Perm', 'no-show')
    await addAppt(u, 'Leo', 'Blowout', 'booked')
    await u.click(screen.getByRole('button', { name: 'No-show' }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Kim')).toBeInTheDocument()
    expect(screen.queryByText('Leo')).not.toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Mia', 'Cut', 'booked')
    await addAppt(u, 'Ned', 'Wax', 'done')
    await u.click(screen.getByRole('button', { name: 'Booked' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('Summary shows correct totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Ona', 'Cut', 'booked')
    await addAppt(u, 'Pat', 'Style', 'done')
    await addAppt(u, 'Quinn', 'Color', 'no-show')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('No-show: 1')).toBeInTheDocument()
  })

  it('Summary Completion is 0% with no appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary Completion reflects marking done (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Rose', 'Cut')
    await addAppt(u, 'Sam', 'Color')
    await u.click(within(apptRow('Rose')).getByRole('button', { name: /mark done rose/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('toggles theme and persists across navigation', async () => {
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

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Tia', 'Highlights')
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByText('Tia')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('adds appointment with done status and Summary reflects it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Uma', 'Blowout', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })
})
