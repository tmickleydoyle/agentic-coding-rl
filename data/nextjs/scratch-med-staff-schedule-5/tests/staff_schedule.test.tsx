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

  it('shows Showing total: 0 hrs on an empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing total: 0 hrs')).toBeInTheDocument()
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

  it('adds a shift and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    expect(screen.getByText('Alice — 8 hrs')).toBeInTheDocument()
  })

  it('updates the showing total after adding a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Bob', '6')
    expect(screen.getByText('Showing total: 6 hrs')).toBeInTheDocument()
  })

  it('accumulates showing total across multiple shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '5')
    expect(screen.getByText('Showing total: 13 hrs')).toBeInTheDocument()
  })

  it('ignores a shift with a blank employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/employee name/i))
    await u.type(screen.getByLabelText(/^hours$/i), '8')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Showing total: 0 hrs')).toBeInTheDocument()
  })

  it('ignores a shift with blank hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/employee name/i), 'Carol')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Showing total: 0 hrs')).toBeInTheDocument()
  })

  it('removes a shift and updates the total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    const removeBtn = screen.getByRole('button', { name: /remove shift/i })
    await u.click(removeBtn)
    expect(screen.queryByText('Alice — 8 hrs')).not.toBeInTheDocument()
    expect(screen.getByText('Showing total: 0 hrs')).toBeInTheDocument()
  })

  it('filter dropdown shows All plus each distinct employee', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    const select = screen.getByLabelText(/filter by employee/i)
    const options = within(select as HTMLElement).getAllByRole('option')
    const texts = options.map((o) => o.textContent)
    expect(texts).toContain('All')
    expect(texts).toContain('Alice')
    expect(texts).toContain('Bob')
  })

  it('filter by employee shows only that employee shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Alice — 8 hrs')).toBeInTheDocument()
    expect(screen.queryByText('Bob — 6 hrs')).not.toBeInTheDocument()
  })

  it('filtered total reflects only visible shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Bob', '6')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Showing total: 12 hrs')).toBeInTheDocument()
  })

  it('selecting All after filtering restores all shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '6')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'All')
    expect(screen.getByText('Alice — 8 hrs')).toBeInTheDocument()
    expect(screen.getByText('Bob — 6 hrs')).toBeInTheDocument()
    expect(screen.getByText('Showing total: 14 hrs')).toBeInTheDocument()
  })

  it('Summary shows No shifts recorded when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('Summary shows correct totals after adding shifts (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '5')
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 2')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 13')).toBeInTheDocument()
  })

  it('Summary shows per-employee totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Bob', '6')
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 12 hrs')).toBeInTheDocument()
    expect(screen.getByText('Bob: 6 hrs')).toBeInTheDocument()
  })

  it('Summary updates after removing a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '5')
    const removeBtn = screen.getAllByRole('button', { name: /remove shift/i })[0]
    await u.click(removeBtn)
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 1')).toBeInTheDocument()
  })

  it('preserves shift list state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '7')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByText('Carol — 7 hrs')).toBeInTheDocument()
  })

  it('toggles theme and persists it across views', async () => {
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

  it('Summary shows no per-employee line after all shifts removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    const removeBtn = screen.getByRole('button', { name: /remove shift/i })
    await u.click(removeBtn)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
    expect(screen.queryByText(/Alice/)).not.toBeInTheDocument()
  })
})
