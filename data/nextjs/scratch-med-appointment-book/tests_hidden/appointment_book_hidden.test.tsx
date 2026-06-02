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

describe('Appointment Book (held-out)', () => {
  it('all filter button shows combined count after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Grace', 'Trim')
    await addAppt(u, 'Hank', 'Beard')
    expect(screen.getByRole('button', { name: 'All (5)' })).toBeInTheDocument()
  })

  it('filter persists when adding new appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Booked (1)' }))
    await addAppt(u, 'Iris', 'Color', 'booked')
    expect(screen.getByText('Iris')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Booked (2)' })).toBeInTheDocument()
  })

  it('changing status to no-show updates no-show count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Bob'), 'no-show')
    expect(screen.getByRole('button', { name: 'No-show (2)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Done (0)' })).toBeInTheDocument()
  })

  it('no-show count in summary updates after status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Alice'), 'no-show')
    await nav(u, 'Summary')
    expect(screen.getByText('No-show: 2')).toBeInTheDocument()
    expect(screen.getByText('Booked: 0')).toBeInTheDocument()
  })

  it('deleting all appointments gives Showing: 0 appointment(s)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await u.click(screen.getByRole('button', { name: 'Delete Bob' }))
    await u.click(screen.getByRole('button', { name: 'Delete Carol' }))
    expect(screen.getByText('Showing: 0 appointment(s)')).toBeInTheDocument()
  })

  it('filter by Done shows 0 appointments when none are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Bob'), 'booked')
    await u.click(screen.getByRole('button', { name: 'Done (0)' }))
    expect(screen.getByText('Showing: 0 appointment(s)')).toBeInTheDocument()
  })

  it('adding no-show appointment updates summary no-show count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Jack', 'Trim', 'no-show')
    await nav(u, 'Summary')
    expect(screen.getByText('No-show: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('completion rate rounds correctly for 2 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Alice'), 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Completion rate: 67%')).toBeInTheDocument()
  })

  it('restoring All filter after Booked shows all rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Booked (1)' }))
    expect(screen.getByText('Showing: 1 appointment(s)')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All (3)' }))
    expect(screen.getByText('Showing: 3 appointment(s)')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })
})
