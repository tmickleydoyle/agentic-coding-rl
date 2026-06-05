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

  it('adds a shift and displays it in the correct format', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    expect(screen.getByText('Alice — 8h')).toBeInTheDocument()
  })

  it('displays a fractional shift correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Bob', '7.5')
    expect(screen.getByText('Bob — 7.5h')).toBeInTheDocument()
  })

  it('shows Total hours for a single shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    expect(screen.getByText('Total hours: 8h')).toBeInTheDocument()
  })

  it('shows Total hours summed across multiple shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    expect(screen.getByText('Total hours: 14h')).toBeInTheDocument()
  })

  it('ignores blank employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '8')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Total hours: 0h')).toBeInTheDocument()
  })

  it('removes a shift and updates total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    const removeButtons = screen.getAllByRole('button', { name: /remove shift/i })
    await u.click(removeButtons[0])
    expect(screen.getByText('Total hours: 6h')).toBeInTheDocument()
    expect(screen.queryByText('Alice — 8h')).not.toBeInTheDocument()
  })

  it('filter by employee dropdown narrows list and total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Bob', '6')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.queryByText('Bob — 6h')).not.toBeInTheDocument()
    expect(screen.getByText('Total hours: 12h')).toBeInTheDocument()
  })

  it('restoring All employees shows full total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'All employees')
    expect(screen.getByText('Total hours: 14h')).toBeInTheDocument()
  })

  it('Summary shows No shifts recorded when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('Summary shows per-employee totals and grand total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Bob', '6')
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 12h')).toBeInTheDocument()
    expect(screen.getByText('Bob: 6h')).toBeInTheDocument()
    expect(screen.getByText('Grand total: 18h')).toBeInTheDocument()
  })

  it('Summary shows fractional hours correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '7.5')
    await nav(u, 'Summary')
    expect(screen.getByText('Carol: 7.5h')).toBeInTheDocument()
    expect(screen.getByText('Grand total: 7.5h')).toBeInTheDocument()
  })

  it('removing all shifts causes Summary to show No shifts recorded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    const removeBtn = screen.getByRole('button', { name: /remove shift/i })
    await u.click(removeBtn)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('theme defaults to light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Shifts')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('shift list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dave', '10')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByText('Dave — 10h')).toBeInTheDocument()
  })

  it('employee filter dropdown lists unique employees', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Bob', '6')
    const select = screen.getByLabelText(/filter by employee/i)
    const options = within(select as HTMLElement).getAllByRole('option')
    const names = options.map((o) => o.textContent)
    expect(names).toContain('All employees')
    expect(names).toContain('Alice')
    expect(names).toContain('Bob')
    // Alice should only appear once
    expect(names.filter((n) => n === 'Alice').length).toBe(1)
  })
})
