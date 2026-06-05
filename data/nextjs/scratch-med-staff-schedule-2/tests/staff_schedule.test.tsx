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

  it('navigates back to Shifts view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByRole('heading', { name: 'Shifts' })).toBeInTheDocument()
  })

  it('shows no shifts recorded in Summary when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('adds a shift and displays it correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    expect(screen.getByText('Alice — 6h')).toBeInTheDocument()
  })

  it('shows the visible total after adding shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '8')
    expect(screen.getByText('Visible total: 14h')).toBeInTheDocument()
  })

  it('ignores a blank employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '5')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })

  it('ignores a zero hours value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/employee name/i), 'Charlie')
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '0')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })

  it('deletes a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    const deleteBtn = screen.getByRole('button', { name: /delete shift/i })
    await u.click(deleteBtn)
    expect(screen.queryByText('Alice — 6h')).not.toBeInTheDocument()
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })

  it('filter by employee shows only that employee', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '8')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Alice — 6h')).toBeInTheDocument()
    expect(screen.queryByText('Bob — 8h')).not.toBeInTheDocument()
  })

  it('visible total reflects filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '8')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Visible total: 6h')).toBeInTheDocument()
  })

  it('selecting All shows all shifts again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '8')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'All')
    expect(screen.getByText('Alice — 6h')).toBeInTheDocument()
    expect(screen.getByText('Bob — 8h')).toBeInTheDocument()
    expect(screen.getByText('Visible total: 14h')).toBeInTheDocument()
  })

  it('Summary shows per-employee totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Bob', '8')
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 10h')).toBeInTheDocument()
    expect(screen.getByText('Bob: 8h')).toBeInTheDocument()
  })

  it('Summary shows total employees and grand total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '8')
    await nav(u, 'Summary')
    expect(screen.getByText('Total employees: 2')).toBeInTheDocument()
    expect(screen.getByText('Grand total: 14h')).toBeInTheDocument()
  })

  it('Summary grand total uses all shifts, ignoring any filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '5')
    await addShift(u, 'Carol', '9')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await nav(u, 'Summary')
    expect(screen.getByText('Grand total: 14h')).toBeInTheDocument()
  })

  it('Summary disappears a deleted employee', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dave', '7')
    const deleteBtn = screen.getByRole('button', { name: /delete shift/i })
    await u.click(deleteBtn)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Eve', '12')
    await nav(u, 'Settings')
    await nav(u, 'Shifts')
    expect(screen.getByText('Eve — 12h')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
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
    await nav(u, 'Shifts')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('multiple shifts for same employee stack in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Frank', '3')
    await addShift(u, 'Frank', '3')
    await addShift(u, 'Frank', '3')
    await nav(u, 'Summary')
    expect(screen.getByText('Frank: 9h')).toBeInTheDocument()
    expect(screen.getByText('Total employees: 1')).toBeInTheDocument()
    expect(screen.getByText('Grand total: 9h')).toBeInTheDocument()
  })
})
