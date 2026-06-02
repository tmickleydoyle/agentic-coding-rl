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

  it('shows Showing: 0h when there are no shifts', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0h')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Shifts')
    expect(screen.getByRole('heading', { name: 'Shifts' })).toBeInTheDocument()
  })

  it('adds a shift and displays it correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    expect(screen.getByText('Alice — 8h')).toBeInTheDocument()
  })

  it('updates Showing total after adding shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    expect(screen.getByText('Showing: 14h')).toBeInTheDocument()
  })

  it('ignores a blank employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '8')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Showing: 0h')).toBeInTheDocument()
  })

  it('ignores a shift with zero hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/employee name/i), 'Alice')
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '0')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Showing: 0h')).toBeInTheDocument()
  })

  it('removes a shift when Remove is clicked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    expect(screen.getByText('Alice — 8h')).toBeInTheDocument()
    const removeBtn = screen.getByRole('button', { name: /remove shift/i })
    await u.click(removeBtn)
    expect(screen.queryByText('Alice — 8h')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0h')).toBeInTheDocument()
  })

  it('populates the filter dropdown with unique employee names', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    await addShift(u, 'Alice', '4')
    const select = screen.getByLabelText(/filter by employee/i)
    expect(within(select as HTMLElement).getByRole('option', { name: 'All' })).toBeInTheDocument()
    expect(within(select as HTMLElement).getByRole('option', { name: 'Alice' })).toBeInTheDocument()
    expect(within(select as HTMLElement).getByRole('option', { name: 'Bob' })).toBeInTheDocument()
    const options = within(select as HTMLElement).getAllByRole('option')
    expect(options.length).toBe(3)
  })

  it('filters shifts by employee and updates Showing total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    await addShift(u, 'Alice', '4')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Alice')
    expect(screen.getByText('Alice — 8h')).toBeInTheDocument()
    expect(screen.getByText('Alice — 4h')).toBeInTheDocument()
    expect(screen.queryByText('Bob — 6h')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 12h')).toBeInTheDocument()
  })

  it('restores all shifts when filter is set back to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Alice')
    await u.selectOptions(select, 'All')
    expect(screen.getByText('Alice — 8h')).toBeInTheDocument()
    expect(screen.getByText('Bob — 6h')).toBeInTheDocument()
    expect(screen.getByText('Showing: 14h')).toBeInTheDocument()
  })

  it('Summary shows total hours and employee count (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    await addShift(u, 'Alice', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Total hours: 18h')).toBeInTheDocument()
    expect(screen.getByText('Employees: 2')).toBeInTheDocument()
  })

  it('Summary lists per-employee totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Bob', '6')
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 12h')).toBeInTheDocument()
    expect(screen.getByText('Bob: 6h')).toBeInTheDocument()
  })

  it('Summary counts all shifts even when filter is active on Shifts view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Alice')
    await nav(u, 'Summary')
    expect(screen.getByText('Total hours: 14h')).toBeInTheDocument()
    expect(screen.getByText('Employees: 2')).toBeInTheDocument()
  })

  it('Summary shows 0 employees and 0 total when no shifts exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Employees: 0')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 0h')).toBeInTheDocument()
  })

  it('shifts state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '10')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByText('Carol — 10h')).toBeInTheDocument()
    expect(screen.getByText('Showing: 10h')).toBeInTheDocument()
  })

  it('toggles theme and persists data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Shifts')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('removing a shift updates Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    // remove the 8h shift
    const items = screen.getAllByRole('listitem')
    const eightHItem = items.find((li) => li.textContent?.includes('Alice — 8h'))
    if (!eightHItem) throw new Error('could not find 8h item')
    await u.click(within(eightHItem).getByRole('button', { name: /remove shift/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 4h')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 4h')).toBeInTheDocument()
  })

  it('clears the input fields after adding a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dave', '7')
    expect(screen.getByLabelText(/employee name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^hours$/i)).toHaveValue(null)
  })
})
