import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('Appointment Book (held-out)', () => {
  it('multiple no-shows give correct rate of 67%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'P1', 'Cut', 'no-show')
    await addAppt(u, 'P2', 'Color', 'no-show')
    await addAppt(u, 'P3', 'Blowout', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('No-show rate: 67%')).toBeInTheDocument()
    expect(screen.getByText('No-show: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('filter count resets to correct value after switching filters', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'A', 'S1', 'booked')
    await addAppt(u, 'B', 'S2', 'booked')
    await addAppt(u, 'C', 'S3', 'done')
    await u.click(screen.getByRole('button', { name: 'Booked' }))
    expect(screen.getByText('Showing: 2 appointments')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Showing: 1 appointments')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 3 appointments')).toBeInTheDocument()
  })

  it('deleting a no-show updates the Summary no-show rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'X', 'Wax', 'no-show')
    await addAppt(u, 'Y', 'Trim', 'booked')
    await u.click(screen.getByRole('button', { name: /delete x/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('No-show: 0')).toBeInTheDocument()
    expect(screen.getByText('No-show rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })

  it('no-show filter shows zero count when none exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Z', 'Facial', 'booked')
    await u.click(screen.getByRole('button', { name: 'No-show' }))
    expect(screen.getByText('Showing: 0 appointments')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('adding multiple appointments each visible in All filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Ann', 'Haircut', 'booked')
    await addAppt(u, 'Ben', 'Shave', 'done')
    await addAppt(u, 'Cat', 'Wax', 'no-show')
    expect(screen.getByText('Ann — Haircut — booked')).toBeInTheDocument()
    expect(screen.getByText('Ben — Shave — done')).toBeInTheDocument()
    expect(screen.getByText('Cat — Wax — no-show')).toBeInTheDocument()
    expect(screen.getByText('Showing: 3 appointments')).toBeInTheDocument()
  })

  it('Summary booked count reflects correctly after deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'M1', 'Cut', 'booked')
    await addAppt(u, 'M2', 'Color', 'booked')
    await u.click(screen.getByRole('button', { name: /delete m1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })
})
