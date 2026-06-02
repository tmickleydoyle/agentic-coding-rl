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

  it('navigates back to Shifts from Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await nav(u, 'Shifts')
    expect(screen.getByRole('heading', { name: 'Shifts' })).toBeInTheDocument()
  })

  it('adds a shift and shows it formatted correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    expect(screen.getByText('Alice — 8 hrs')).toBeInTheDocument()
  })

  it('shows Total hours: 0 when no shifts', () => {
    render(<App />)
    expect(screen.getByText('Total hours: 0')).toBeInTheDocument()
  })

  it('updates total hours after adding shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    expect(screen.getByText('Total hours: 14')).toBeInTheDocument()
  })

  it('ignores a shift with blank employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '8')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Total hours: 0')).toBeInTheDocument()
  })

  it('ignores a shift with zero hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/employee name/i), 'Alice')
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '0')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Total hours: 0')).toBeInTheDocument()
  })

  it('removes a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    expect(screen.getByText('Alice — 8 hrs')).toBeInTheDocument()
    const removeBtn = screen.getByRole('button', { name: /remove shift/i })
    await u.click(removeBtn)
    expect(screen.queryByText('Alice — 8 hrs')).not.toBeInTheDocument()
    expect(screen.getByText('Total hours: 0')).toBeInTheDocument()
  })

  it('filter by employee shows only their shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '5')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Alice')
    expect(screen.getByText('Alice — 8 hrs')).toBeInTheDocument()
    expect(screen.queryByText('Bob — 5 hrs')).not.toBeInTheDocument()
  })

  it('filter updates Total hours to show only filtered shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '5')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Alice')
    expect(screen.getByText('Total hours: 8')).toBeInTheDocument()
  })

  it('filter All shows everyone again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '5')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Alice')
    await u.selectOptions(select, 'All')
    expect(screen.getByText('Alice — 8 hrs')).toBeInTheDocument()
    expect(screen.getByText('Bob — 5 hrs')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 13')).toBeInTheDocument()
  })

  it('Summary shows No shifts recorded when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('Summary shows total shifts count and per-employee totals (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Bob', '6')
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 3')).toBeInTheDocument()
    expect(screen.getByText('Alice: 12 hrs')).toBeInTheDocument()
    expect(screen.getByText('Bob: 6 hrs')).toBeInTheDocument()
  })

  it('Summary updates after removing a shift (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    const removeBtns = screen.getAllByRole('button', { name: /remove shift/i })
    await u.click(removeBtns[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 1')).toBeInTheDocument()
  })

  it('theme toggles to dark and persists across views', async () => {
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

  it('shifts list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '9')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByText('Carol — 9 hrs')).toBeInTheDocument()
  })

  it('multiple shifts for the same employee appear in filter dropdown once', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    const select = screen.getByLabelText(/filter by employee/i)
    const options = within(select).getAllByRole('option')
    const aliceOptions = options.filter((o) => o.textContent === 'Alice')
    expect(aliceOptions).toHaveLength(1)
  })
})
