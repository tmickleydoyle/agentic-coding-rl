// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view sequences.
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

describe('Appointment Book (held-out)', () => {
  it('heading count updates as appointments are added one by one', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Appointments (0)' })).toBeInTheDocument()
    await addAppt(u, 'Andy', 'Trim')
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
    await addAppt(u, 'Beth', 'Color')
    expect(screen.getByRole('heading', { name: 'Appointments (2)' })).toBeInTheDocument()
  })

  it('heading count reflects filtered visible appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Cara', 'Haircut')
    await addAppt(u, 'Dan', 'Shave')
    await addAppt(u, 'Eli', 'Facial')
    await u.click(within(apptRow('Cara')).getByRole('button', { name: /mark done cara/i }))
    await u.click(within(apptRow('Dan')).getByRole('button', { name: /mark no-show dan/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
  })

  it('switching filter back to All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Faye', 'Massage')
    await addAppt(u, 'Greg', 'Waxing')
    await u.click(within(apptRow('Faye')).getByRole('button', { name: /mark done faye/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByRole('heading', { name: 'Appointments (2)' })).toBeInTheDocument()
    expect(screen.getByText('Faye')).toBeInTheDocument()
    expect(screen.getByText('Greg')).toBeInTheDocument()
  })

  it('both status buttons start enabled on a new booked appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Hank', 'Cut')
    expect(within(apptRow('Hank')).getByRole('button', { name: /mark done hank/i })).not.toBeDisabled()
    expect(within(apptRow('Hank')).getByRole('button', { name: /mark no-show hank/i })).not.toBeDisabled()
  })

  it('after marking done, mark no-show button is still enabled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Iris', 'Pedicure')
    await u.click(within(apptRow('Iris')).getByRole('button', { name: /mark done iris/i }))
    expect(within(apptRow('Iris')).getByRole('button', { name: /mark no-show iris/i })).not.toBeDisabled()
  })

  it('summary completion rounds correctly for two of four done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Jake', 'Cut')
    await addAppt(u, 'Kira', 'Color')
    await addAppt(u, 'Leo', 'Trim')
    await addAppt(u, 'Mona', 'Facial')
    await u.click(within(apptRow('Jake')).getByRole('button', { name: /mark done jake/i }))
    await u.click(within(apptRow('Kira')).getByRole('button', { name: /mark done kira/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('clear all then add new appointment works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Nina', 'Waxing')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all appointments/i }))
    await nav(u, 'Appointments')
    expect(screen.getByRole('heading', { name: 'Appointments (0)' })).toBeInTheDocument()
    await addAppt(u, 'Omar', 'Shave')
    expect(screen.getByRole('heading', { name: 'Appointments (1)' })).toBeInTheDocument()
    expect(screen.getByText('Omar')).toBeInTheDocument()
  })

  it('theme toggle shows current theme in button text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('no-show appointments appear in summary No-show count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Pia', 'Trim')
    await addAppt(u, 'Quinn', 'Color')
    await u.click(within(apptRow('Pia')).getByRole('button', { name: /mark no-show pia/i }))
    await u.click(within(apptRow('Quinn')).getByRole('button', { name: /mark no-show quinn/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('No-show: 2')).toBeInTheDocument()
    expect(screen.getByText('Booked: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })
})
