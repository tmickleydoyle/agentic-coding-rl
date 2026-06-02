import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addShift(u: U, name: string, hours: string) {
  await u.clear(screen.getByLabelText(/employee name/i))
  await u.type(screen.getByLabelText(/employee name/i), name)
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

  it('navigates back to Shifts from Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByRole('heading', { name: 'Shifts' })).toBeInTheDocument()
  })

  it('shows Showing: 0 shifts when empty', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 shifts')).toBeInTheDocument()
  })

  it('adds a shift and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    expect(screen.getByText('Alice — 8 hrs')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 shifts')).toBeInTheDocument()
  })

  it('ignores a shift with a blank employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '8')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Showing: 0 shifts')).toBeInTheDocument()
  })

  it('ignores a shift with zero hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Bob', '0')
    expect(screen.getByText('Showing: 0 shifts')).toBeInTheDocument()
  })

  it('ignores a shift with negative hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Bob', '-4')
    expect(screen.getByText('Showing: 0 shifts')).toBeInTheDocument()
  })

  it('removes a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '6')
    expect(screen.getByText('Carol — 6 hrs')).toBeInTheDocument()
    const removeBtn = screen.getByRole('button', { name: /remove shift/i })
    await u.click(removeBtn)
    expect(screen.queryByText('Carol — 6 hrs')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 shifts')).toBeInTheDocument()
  })

  it('filters shifts by employee', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Showing: 1 shifts')).toBeInTheDocument()
    expect(screen.getByText('Alice — 8 hrs')).toBeInTheDocument()
    expect(screen.queryByText('Bob — 6 hrs')).not.toBeInTheDocument()
  })

  it('restores all shifts when filter set back to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'All')
    expect(screen.getByText('Showing: 2 shifts')).toBeInTheDocument()
  })

  it('shows Total hours: 0 and Employees: 0 on empty Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total hours: 0')).toBeInTheDocument()
    expect(screen.getByText('Employees: 0')).toBeInTheDocument()
  })

  it('Summary shows correct totals per employee (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Bob', '6')
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 12 hrs')).toBeInTheDocument()
    expect(screen.getByText('Bob: 6 hrs')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 18')).toBeInTheDocument()
    expect(screen.getByText('Employees: 2')).toBeInTheDocument()
  })

  it('Summary updates after removing a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '5')
    const removeButtons = screen.getAllByRole('button', { name: /remove shift/i })
    await u.click(removeButtons[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total hours: 5')).toBeInTheDocument()
    expect(screen.getByText('Employees: 1')).toBeInTheDocument()
  })

  it('toggles theme and shows it in Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByText('Current theme: dark')).toBeInTheDocument()
  })

  it('applies data-theme attribute to root element', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Shifts')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('shift list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dan', '7')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByText('Dan — 7 hrs')).toBeInTheDocument()
  })

  it('multiple shifts for same employee accumulate showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Eve', '4')
    await addShift(u, 'Eve', '5')
    await addShift(u, 'Eve', '3')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Eve')
    expect(screen.getByText('Showing: 3 shifts')).toBeInTheDocument()
  })
})
