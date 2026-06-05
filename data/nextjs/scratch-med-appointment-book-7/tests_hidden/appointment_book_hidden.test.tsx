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

describe('Appointment Book (held-out)', () => {
  it('all three seed customers are visible on first render', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('adding a no-show appointment increases no-show count in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppointment(u, 'Frank', 'Trim', 'no-show')
    await nav(u, 'Summary')
    expect(screen.getByText('No-show: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('completion is 0% when all appointments are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('filter count heading reflects filtered appointments not total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppointment(u, 'Gina', 'Blowout', 'booked')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    expect(screen.getByRole('heading', { name: 'Appointments (2)' })).toBeInTheDocument()
  })

  it('deleting while filtered only removes the targeted appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Appointments (2)' })).toBeInTheDocument()
  })

  it('summary booked count updates after deleting a booked appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Booked: 0')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('completion rounds to 100% when all remaining appointments are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('theme toggle button label updates after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('adding multiple appointments accumulates correctly in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppointment(u, 'Hank', 'Cut', 'done')
    await addAppointment(u, 'Iris', 'Style', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 60%')).toBeInTheDocument()
  })
})
