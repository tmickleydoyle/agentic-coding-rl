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

describe('Appointment Book (held-out)', () => {
  it('three appointments with different statuses all appear under All filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Vera', 'Cut', 'booked')
    await addAppt(u, 'Walt', 'Dye', 'done')
    await addAppt(u, 'Xena', 'Trim', 'no-show')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('Booked filter count updates after marking one done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Yara', 'Perm', 'booked')
    await addAppt(u, 'Zoe', 'Curl', 'booked')
    await u.click(within(apptRow('Yara')).getByRole('button', { name: /mark done yara/i }))
    await u.click(screen.getByRole('button', { name: 'Booked' }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Zoe')).toBeInTheDocument()
    expect(screen.queryByText('Yara')).not.toBeInTheDocument()
  })

  it('No-show filter count updates after marking one no-show', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Abe', 'Wax', 'booked')
    await addAppt(u, 'Bea', 'Spray', 'booked')
    await u.click(within(apptRow('Abe')).getByRole('button', { name: /mark no-show abe/i }))
    await u.click(screen.getByRole('button', { name: 'No-show' }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Abe')).toBeInTheDocument()
  })

  it('Completion rounds to nearest whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Cal', 'Cut', 'done')
    await addAppt(u, 'Del', 'Style', 'booked')
    await addAppt(u, 'Eli', 'Color', 'booked')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary Booked count decreases after marking done cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Fay', 'Rinse', 'booked')
    await addAppt(u, 'Gil', 'Cut', 'booked')
    await u.click(within(apptRow('Fay')).getByRole('button', { name: /mark done fay/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('inputs are cleared after adding an appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Hal', 'Tint')
    expect(screen.getByLabelText('Customer')).toHaveValue('')
    expect(screen.getByLabelText('Service')).toHaveValue('')
  })

  it('multiple appointments share no state between rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Ida', 'Gloss', 'booked')
    await addAppt(u, 'Jon', 'Shave', 'booked')
    await u.click(within(apptRow('Jon')).getByRole('button', { name: /mark done jon/i }))
    expect(within(apptRow('Ida')).getByText('booked')).toBeInTheDocument()
    expect(within(apptRow('Jon')).getByText('done')).toBeInTheDocument()
  })

  it('Done filter is empty initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Kay', 'Clip', 'booked')
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('Summary updates after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Lou', 'Press', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    await nav(u, 'Appointments')
    await addAppt(u, 'Mae', 'Roll', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })
})
