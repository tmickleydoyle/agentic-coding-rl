// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addShift(u: U, employee: string, hours: string) {
  await u.clear(screen.getByLabelText(/employee name/i))
  await u.type(screen.getByLabelText(/employee name/i), employee)
  await u.clear(screen.getByLabelText(/^hours$/i))
  await u.type(screen.getByLabelText(/^hours$/i), hours)
  await u.click(screen.getByRole('button', { name: /add shift/i }))
}

describe('Staff Shift Scheduler (held-out)', () => {
  it('seeded data has correct per-employee totals in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 12h')).toBeInTheDocument()
    expect(screen.getByText('Bob: 6h')).toBeInTheDocument()
  })

  it('filter by Bob shows only his shift and correct total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Bob')
    expect(screen.getByText('Bob — 6h')).toBeInTheDocument()
    expect(screen.queryByText('Alice — 8h')).not.toBeInTheDocument()
    expect(screen.getByText('Visible total: 6h')).toBeInTheDocument()
  })

  it('adding a second shift for Bob updates his Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Bob', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Bob: 10h')).toBeInTheDocument()
  })

  it('ignores negative hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Zara', '-3')
    expect(screen.queryByText(/Zara/)).not.toBeInTheDocument()
    expect(screen.getByText('Visible total: 18h')).toBeInTheDocument()
  })

  it('deleting one Alice shift adjusts her Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    // delete Alice 8h row
    const alice8 = screen.getByText('Alice — 8h').closest('li') as HTMLElement
    await u.click(within(alice8).getByRole('button', { name: /delete/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 4h')).toBeInTheDocument()
    expect(screen.getByText('Total shifts: 2')).toBeInTheDocument()
  })

  it('filtered visible total updates after deletion within filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    const alice4 = screen.getByText('Alice — 4h').closest('li') as HTMLElement
    await u.click(within(alice4).getByRole('button', { name: /delete/i }))
    expect(screen.getByText('Visible total: 8h')).toBeInTheDocument()
  })

  it('new employee appears in filter dropdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dana', '3')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Dana')
    expect(screen.getByText('Dana — 3h')).toBeInTheDocument()
    expect(screen.getByText('Visible total: 3h')).toBeInTheDocument()
  })

  it('Summary shows new employee after adding shift, not shown before', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.queryByText(/Frank/)).not.toBeInTheDocument()
    await nav(u, 'Shifts')
    await addShift(u, 'Frank', '10')
    await nav(u, 'Summary')
    expect(screen.getByText('Frank: 10h')).toBeInTheDocument()
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

  it('clear all then add new shift shows only new shift in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all shifts/i }))
    await nav(u, 'Shifts')
    await addShift(u, 'Hana', '11')
    await nav(u, 'Summary')
    expect(screen.queryByText(/Alice/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Bob/)).not.toBeInTheDocument()
    expect(screen.getByText('Hana: 11h')).toBeInTheDocument()
    expect(screen.getByText('Total shifts: 1')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 11h')).toBeInTheDocument()
  })
})
