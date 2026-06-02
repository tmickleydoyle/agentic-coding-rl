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

  it('shows seeded appointments on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows correct initial filter counts', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'All (3)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Booked (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Done (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No-show (1)' })).toBeInTheDocument()
  })

  it('shows correct showing count initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 appointment(s)')).toBeInTheDocument()
  })

  it('adds a new appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Dave', 'Pedicure')
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByText('Pedicure')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All (4)' })).toBeInTheDocument()
  })

  it('ignores blank customer or service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add appointment/i }))
    expect(screen.getByRole('button', { name: 'All (3)' })).toBeInTheDocument()
  })

  it('deletes an appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All (2)' })).toBeInTheDocument()
  })

  it('filters by Booked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Booked (1)' }))
    expect(screen.getByText('Showing: 1 appointment(s)')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('filters by Done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Done (1)' }))
    expect(screen.getByText('Showing: 1 appointment(s)')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('filters by No-show', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'No-show (1)' }))
    expect(screen.getByText('Showing: 1 appointment(s)')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('changes status inline and updates filter counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Alice'), 'done')
    expect(screen.getByRole('button', { name: 'Booked (0)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Done (2)' })).toBeInTheDocument()
  })

  it('status change cross-view: summary updates after inline status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Alice'), 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Booked: 0')).toBeInTheDocument()
  })

  it('summary shows seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('No-show: 1')).toBeInTheDocument()
  })

  it('summary completion rate is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Completion rate: 33%')).toBeInTheDocument()
  })

  it('summary completion rate is 0% with no appointments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await u.click(screen.getByRole('button', { name: 'Delete Bob' }))
    await u.click(screen.getByRole('button', { name: 'Delete Carol' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion rate: 0%')).toBeInTheDocument()
  })

  it('summary completion rate is 100% when all done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Alice'), 'done')
    await u.selectOptions(screen.getByLabelText('Status for Carol'), 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Completion rate: 100%')).toBeInTheDocument()
  })

  it('theme toggles via data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Appointments')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Eve', 'Waxing')
    await nav(u, 'Summary')
    await nav(u, 'Appointments')
    expect(screen.getByText('Eve')).toBeInTheDocument()
  })

  it('add appointment with done status updates summary immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Frank', 'Shave', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
  })
})
