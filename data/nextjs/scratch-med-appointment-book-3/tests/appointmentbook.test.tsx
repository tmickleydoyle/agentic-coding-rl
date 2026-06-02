import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAppt(u: U, customer: string, service: string) {
  await u.clear(screen.getByLabelText('Customer'))
  await u.type(screen.getByLabelText('Customer'), customer)
  await u.clear(screen.getByLabelText('Service'))
  await u.type(screen.getByLabelText('Service'), service)
  await u.click(screen.getByRole('button', { name: /add appointment/i }))
}

function apptRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

describe('Appointment Book app', () => {
  it('starts on the Appointments view with empty list', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Appointments (0)' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Appointments (0)' })).toBeInTheDocument()
  })

  it('adds an appointment and shows it with booked status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Alice', 'Haircut')
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(within(apptRow('Alice')).getByText('booked')).toBeInTheDocument()
  })

  it('ignores appointment with blank customer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Service'))
    await u.type(screen.getByLabelText('Service'), 'Manicure')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByRole('heading', { name: 'Appointments (0)' })).toBeInTheDocument()
  })

  it('ignores appointment with blank service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer'), 'Bob')
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByRole('heading', { name: 'Appointments (0)' })).toBeInTheDocument()
  })

  it('marks an appointment as done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Carol', 'Massage')
    await u.click(within(apptRow('Carol')).getByRole('button', { name: /mark done carol/i }))
    expect(within(apptRow('Carol')).getByText('done')).toBeInTheDocument()
  })

  it('mark done button is disabled once done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Dave', 'Facial')
    await u.click(within(apptRow('Dave')).getByRole('button', { name: /mark done dave/i }))
    expect(within(apptRow('Dave')).getByRole('button', { name: /mark done dave/i })).toBeDisabled()
  })

  it('marks an appointment as no-show', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Eve', 'Waxing')
    await u.click(within(apptRow('Eve')).getByRole('button', { name: /mark no-show eve/i }))
    expect(within(apptRow('Eve')).getByText('no-show')).toBeInTheDocument()
  })

  it('mark no-show button is disabled once no-show', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Frank', 'Pedicure')
    await u.click(within(apptRow('Frank')).getByRole('button', { name: /mark no-show frank/i }))
    expect(within(apptRow('Frank')).getByRole('button', { name: /mark no-show frank/i })).toBeDisabled()
  })

  it('filters by booked status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Grace', 'Haircut')
    await addAppt(u, 'Heidi', 'Massage')
    await u.click(within(apptRow('Grace')).getByRole('button', { name: /mark done grace/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Grace')).not.toBeInTheDocument()
    expect(screen.getByText('Heidi')).toBeInTheDocument()
  })

  it('filters by done status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Ivan', 'Facial')
    await addAppt(u, 'Judy', 'Waxing')
    await u.click(within(apptRow('Ivan')).getByRole('button', { name: /mark done ivan/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
    expect(screen.getByText('Ivan')).toBeInTheDocument()
    expect(screen.queryByText('Judy')).not.toBeInTheDocument()
  })

  it('filters by no-show status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Karl', 'Haircut')
    await addAppt(u, 'Lena', 'Massage')
    await u.click(within(apptRow('Karl')).getByRole('button', { name: /mark no-show karl/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'no-show')
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
    expect(screen.getByText('Karl')).toBeInTheDocument()
    expect(screen.queryByText('Lena')).not.toBeInTheDocument()
  })

  it('summary shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Mia', 'Haircut')
    await addAppt(u, 'Ned', 'Massage')
    await addAppt(u, 'Olga', 'Facial')
    await u.click(within(apptRow('Mia')).getByRole('button', { name: /mark done mia/i }))
    await u.click(within(apptRow('Ned')).getByRole('button', { name: /mark no-show ned/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('No-show: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('summary shows 0% completion when no appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('summary shows 100% completion when all done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Pat', 'Haircut')
    await u.click(within(apptRow('Pat')).getByRole('button', { name: /mark done pat/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('clear all appointments removes everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Quinn', 'Haircut')
    await addAppt(u, 'Rose', 'Massage')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all appointments/i }))
    await nav(u, 'Appointments')
    expect(screen.getByRole('heading', { name: 'Appointments (0)' })).toBeInTheDocument()
    expect(screen.queryByText('Quinn')).not.toBeInTheDocument()
  })

  it('clear all also resets summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Sam', 'Facial')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all appointments/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('persists appointments state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Tara', 'Manicure')
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByText('Tara')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
  })

  it('summary ignores filter — counts all appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Uma', 'Haircut')
    await addAppt(u, 'Vera', 'Massage')
    await u.click(within(apptRow('Uma')).getByRole('button', { name: /mark done uma/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })
})
