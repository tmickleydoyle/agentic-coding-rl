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

describe('Staff Schedule app', () => {
  it('starts on the Shifts view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Shifts' })).toBeInTheDocument()
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

  it('navigates back to Shifts after visiting other views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByRole('heading', { name: 'Shifts' })).toBeInTheDocument()
  })

  it('adds a shift and displays it in the correct format', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    expect(screen.getByText('Alice — 6h')).toBeInTheDocument()
  })

  it('ignores a shift with a blank employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '5')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })

  it('ignores a shift with zero hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/employee name/i), 'Bob')
    await u.type(screen.getByLabelText(/^hours$/i), '0')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })

  it('shows visible total for all shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    expect(screen.getByText('Visible total: 10h')).toBeInTheDocument()
  })

  it('deletes a shift and updates the visible total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    const deleteButtons = screen.getAllByRole('button', { name: /delete shift/i })
    await u.click(deleteButtons[0])
    expect(screen.queryByText('Alice — 6h')).not.toBeInTheDocument()
    expect(screen.getByText('Visible total: 4h')).toBeInTheDocument()
  })

  it('filter dropdown contains All and distinct employee names', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    const select = screen.getByLabelText(/filter by employee/i)
    expect(within(select as HTMLElement).getByRole('option', { name: 'All' })).toBeInTheDocument()
    expect(within(select as HTMLElement).getByRole('option', { name: 'Alice' })).toBeInTheDocument()
    expect(within(select as HTMLElement).getByRole('option', { name: 'Bob' })).toBeInTheDocument()
  })

  it('filtering by employee shows only that employee shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Alice — 6h')).toBeInTheDocument()
    expect(screen.queryByText('Bob — 4h')).not.toBeInTheDocument()
  })

  it('visible total reflects the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Alice', '2')
    await addShift(u, 'Bob', '4')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Visible total: 8h')).toBeInTheDocument()
  })

  it('selecting All after filtering restores all shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'All')
    expect(screen.getByText('Alice — 6h')).toBeInTheDocument()
    expect(screen.getByText('Bob — 4h')).toBeInTheDocument()
    expect(screen.getByText('Visible total: 10h')).toBeInTheDocument()
  })

  it('Summary shows No shifts recorded when list is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('Summary shows correct total shifts and total hours (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 2')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 10h')).toBeInTheDocument()
  })

  it('Summary shows per-employee totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Alice', '2')
    await addShift(u, 'Bob', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 8h')).toBeInTheDocument()
    expect(screen.getByText('Bob: 4h')).toBeInTheDocument()
  })

  it('Summary reflects all shifts even when filter is active on Shifts view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 2')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 10h')).toBeInTheDocument()
    expect(screen.getByText('Bob: 4h')).toBeInTheDocument()
  })

  it('Summary updates after a shift is deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    const deleteButtons = screen.getAllByRole('button', { name: /delete shift/i })
    await u.click(deleteButtons[1])
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 1')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 6h')).toBeInTheDocument()
    expect(screen.queryByText('Bob: 4h')).not.toBeInTheDocument()
  })

  it('shifts state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '8')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByText('Carol — 8h')).toBeInTheDocument()
  })

  it('toggles theme and persists across navigation', async () => {
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

  it('visible total is 0h on empty list', () => {
    render(<App />)
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })
})
