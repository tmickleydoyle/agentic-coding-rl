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

describe('Staff Shift Scheduler', () => {
  it('starts on the Shifts view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Shifts' })).toBeInTheDocument()
  })

  it('shows seeded shifts on load', () => {
    render(<App />)
    expect(screen.getByText('Alice — 8h')).toBeInTheDocument()
    expect(screen.getByText('Bob — 6h')).toBeInTheDocument()
    expect(screen.getByText('Alice — 4h')).toBeInTheDocument()
  })

  it('shows correct visible total for seeded data', () => {
    render(<App />)
    expect(screen.getByText('Visible total: 18h')).toBeInTheDocument()
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

  it('navigates back to Shifts view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByRole('heading', { name: 'Shifts' })).toBeInTheDocument()
  })

  it('adds a new shift and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '5')
    expect(screen.getByText('Carol — 5h')).toBeInTheDocument()
  })

  it('updates visible total after adding a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '5')
    expect(screen.getByText('Visible total: 23h')).toBeInTheDocument()
  })

  it('ignores a shift with blank employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '8')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Visible total: 18h')).toBeInTheDocument()
  })

  it('ignores a shift with zero hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dave', '0')
    expect(screen.queryByText(/Dave/)).not.toBeInTheDocument()
    expect(screen.getByText('Visible total: 18h')).toBeInTheDocument()
  })

  it('deletes a shift and updates the visible total', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Bob has one shift of 6h; delete it
    const bobRow = screen.getByText('Bob — 6h').closest('li') as HTMLElement
    await u.click(within(bobRow).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('Bob — 6h')).not.toBeInTheDocument()
    expect(screen.getByText('Visible total: 12h')).toBeInTheDocument()
  })

  it('filters shifts by employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Alice — 8h')).toBeInTheDocument()
    expect(screen.getByText('Alice — 4h')).toBeInTheDocument()
    expect(screen.queryByText('Bob — 6h')).not.toBeInTheDocument()
  })

  it('shows correct visible total when filtered by Alice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Visible total: 12h')).toBeInTheDocument()
  })

  it('restores all shifts when filter set back to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'All')
    expect(screen.getByText('Bob — 6h')).toBeInTheDocument()
    expect(screen.getByText('Visible total: 18h')).toBeInTheDocument()
  })

  it('Summary shows per-employee totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 12h')).toBeInTheDocument()
    expect(screen.getByText('Bob: 6h')).toBeInTheDocument()
  })

  it('Summary shows total shifts and total hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 3')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 18h')).toBeInTheDocument()
  })

  it('Summary updates after adding a shift (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '7')
    await nav(u, 'Summary')
    expect(screen.getByText('Carol: 7h')).toBeInTheDocument()
    expect(screen.getByText('Total shifts: 4')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 25h')).toBeInTheDocument()
  })

  it('Summary updates after deleting a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    const bobRow = screen.getByText('Bob — 6h').closest('li') as HTMLElement
    await u.click(within(bobRow).getByRole('button', { name: /delete/i }))
    await nav(u, 'Summary')
    expect(screen.queryByText(/Bob/)).not.toBeInTheDocument()
    expect(screen.getByText('Total shifts: 2')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 12h')).toBeInTheDocument()
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
    await nav(u, 'Shifts')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('clear all shifts removes everything and resets totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all shifts/i }))
    await nav(u, 'Shifts')
    expect(screen.queryByText('Alice — 8h')).not.toBeInTheDocument()
    expect(screen.queryByText('Bob — 6h')).not.toBeInTheDocument()
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })

  it('clear all shifts resets Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all shifts/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 0')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 0h')).toBeInTheDocument()
  })

  it('preserves shifts when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Eve', '9')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByText('Eve — 9h')).toBeInTheDocument()
  })
})
