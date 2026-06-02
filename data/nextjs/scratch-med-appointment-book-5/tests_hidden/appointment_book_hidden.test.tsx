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

describe('Appointment Book (held-out)', () => {
  it('all filter shows all appointments including newly added ones', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Frank', 'Shave')
    await u.click(screen.getByRole('button', { name: 'Booked' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 4 appointments')).toBeInTheDocument()
  })

  it('a newly added appointment appears under Booked filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Grace', 'Manicure')
    await u.click(screen.getByRole('button', { name: 'Booked' }))
    expect(screen.getByText('Grace')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 appointments')).toBeInTheDocument()
  })

  it('marking booked appointment done moves it out of Booked filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark alice done/i }))
    await u.click(screen.getByRole('button', { name: 'Booked' }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 appointments')).toBeInTheDocument()
  })

  it('marking booked appointment done makes it appear under Done filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark alice done/i }))
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 appointments')).toBeInTheDocument()
  })

  it('deleting all appointments shows 0 and Summary shows 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    expect(screen.getByText('Showing: 0 appointments')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion rate: 0%')).toBeInTheDocument()
  })

  it('Summary completion rate is 100% when all are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark alice done/i }))
    await u.click(screen.getByRole('button', { name: /mark carol done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion rate: 100%')).toBeInTheDocument()
  })

  it('mark no-show button disabled button on carol is already disabled', () => {
    render(<App />)
    const carolRow = apptRow('Carol')
    expect(within(carolRow).getByRole('button', { name: /mark carol no-show/i })).toBeDisabled()
  })

  it('seeded Bob row shows correct service Massage', () => {
    render(<App />)
    const bobRow = apptRow('Bob')
    expect(within(bobRow).getByText('Massage')).toBeInTheDocument()
  })

  it('filter resets visibility correctly when switching filters', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'No-show' }))
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Summary Booked count updates after adding new appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Hank', 'Trim')
    await addAppt(u, 'Ivy', 'Colour')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
    expect(screen.getByText('Booked: 3')).toBeInTheDocument()
  })
})
