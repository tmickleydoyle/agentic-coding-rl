import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function book(u: U, client: string, stylist: string, start: string, duration: string) {
  await u.clear(screen.getByLabelText(/client/i))
  if (client) await u.type(screen.getByLabelText(/client/i), client)
  await u.selectOptions(screen.getByLabelText(/stylist/i), stylist)
  await u.selectOptions(screen.getByLabelText(/start time/i), start)
  await u.selectOptions(screen.getByLabelText(/duration/i), duration)
  await u.click(screen.getByRole('button', { name: /book slot/i }))
}
const conflictsView = () => screen.getByRole('region', { name: 'Conflicts view' })

describe('Salon scheduling app', () => {
  it('starts on Schedule', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Schedule' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Conflicts')
    expect(screen.getByRole('heading', { name: 'Conflicts' })).toBeInTheDocument()
    await nav(u, 'Reports')
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Schedule')
    expect(screen.getByRole('heading', { name: 'Schedule' })).toBeInTheDocument()
  })

  it('books an appointment showing its time range', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Dana', 'Ava', '9:00', '90 min')
    expect(screen.getByText('Dana with Ava: 9:00-10:30')).toBeInTheDocument()
  })

  it('computes the end time from start plus duration', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Cara', 'Mia', '11:00', '30 min')
    expect(screen.getByText('Cara with Mia: 11:00-11:30')).toBeInTheDocument()
  })

  it('ignores a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, '', 'Ava', '9:00', '60 min')
    await nav(u, 'Reports')
    expect(screen.getByText(/total appointments: 0/i)).toBeInTheDocument()
  })

  it('removes an appointment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'Dana', 'Ava', '9:00', '60 min')
    await u.click(screen.getByRole('button', { name: 'Remove Dana' }))
    expect(screen.queryByText('Dana with Ava: 9:00-10:00')).not.toBeInTheDocument()
  })

  it('flags two overlapping appointments for the same stylist as conflicts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '90 min')
    await book(u, 'B', 'Ava', '10:00', '60 min')
    expect(screen.getByText('A with Ava: 9:00-10:30 (conflict)')).toBeInTheDocument()
    expect(screen.getByText('B with Ava: 10:00-11:00 (conflict)')).toBeInTheDocument()
  })

  it('does not flag back-to-back appointments that only touch', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '60 min')
    await book(u, 'B', 'Ava', '10:00', '60 min')
    expect(screen.getByText('A with Ava: 9:00-10:00')).toBeInTheDocument()
    expect(screen.getByText('B with Ava: 10:00-11:00')).toBeInTheDocument()
  })

  it('does not flag overlapping appointments for different stylists', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '90 min')
    await book(u, 'B', 'Mia', '9:00', '90 min')
    expect(screen.getByText('A with Ava: 9:00-10:30')).toBeInTheDocument()
    expect(screen.getByText('B with Mia: 9:00-10:30')).toBeInTheDocument()
  })

  it('lists conflicting appointments on the Conflicts view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '90 min')
    await book(u, 'B', 'Ava', '10:00', '60 min')
    await book(u, 'C', 'Leo', '9:00', '30 min')
    await nav(u, 'Conflicts')
    expect(within(conflictsView()).getByText(/conflicting appointments: 2/i)).toBeInTheDocument()
    expect(within(conflictsView()).getByText('A with Ava: 9:00-10:30')).toBeInTheDocument()
    expect(within(conflictsView()).getByText('B with Ava: 10:00-11:00')).toBeInTheDocument()
    expect(within(conflictsView()).queryByText(/leo/i)).not.toBeInTheDocument()
  })

  it('counts three mutually overlapping appointments all as conflicts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Mia', '9:00', '90 min')
    await book(u, 'B', 'Mia', '9:00', '30 min')
    await book(u, 'C', 'Mia', '10:00', '60 min')
    await nav(u, 'Conflicts')
    expect(within(conflictsView()).getByText(/conflicting appointments: 3/i)).toBeInTheDocument()
  })

  it('reports conflict-free and in-conflict counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '90 min')
    await book(u, 'B', 'Ava', '10:00', '60 min')
    await book(u, 'C', 'Leo', '9:00', '30 min')
    await nav(u, 'Reports')
    expect(screen.getByText(/total appointments: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/conflict-free: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/in conflict: 2/i)).toBeInTheDocument()
  })

  it('reports per-stylist booking counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '30 min')
    await book(u, 'B', 'Ava', '11:00', '30 min')
    await book(u, 'C', 'Mia', '9:00', '30 min')
    await nav(u, 'Reports')
    expect(screen.getByText(/ava booked: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/mia booked: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/leo booked: 0/i)).toBeInTheDocument()
  })

  it('has no conflicts when the schedule is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Conflicts')
    expect(within(conflictsView()).getByText(/conflicting appointments: 0/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reports')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('shows only conflicting rows when Show conflicts only is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '90 min')
    await book(u, 'B', 'Ava', '10:00', '60 min')
    await book(u, 'Clean', 'Leo', '13:00', '30 min')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show conflicts only/i))
    await nav(u, 'Schedule')
    expect(screen.getByText('A with Ava: 9:00-10:30 (conflict)')).toBeInTheDocument()
    expect(screen.queryByText('Clean with Leo: 13:00-13:30')).not.toBeInTheDocument()
  })

  it('keeps clean appointments counted in Reports when filtered out of Schedule', async () => {
    const u = userEvent.setup()
    render(<App />)
    await book(u, 'A', 'Ava', '9:00', '90 min')
    await book(u, 'B', 'Ava', '10:00', '60 min')
    await book(u, 'Clean', 'Leo', '13:00', '30 min')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show conflicts only/i))
    await nav(u, 'Reports')
    expect(screen.getByText(/total appointments: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/conflict-free: 1/i)).toBeInTheDocument()
  })
})
