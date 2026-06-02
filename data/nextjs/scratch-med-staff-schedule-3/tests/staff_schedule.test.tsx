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

  it('renders all three nav buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Shifts' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Summary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
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

  it('shows No shifts recorded in Summary when empty', async () => {
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

  it('ignores blank employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '5')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Showing: 0 total hours')).toBeInTheDocument()
  })

  it('ignores zero or negative hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Bob', '0')
    expect(screen.getByText('Showing: 0 total hours')).toBeInTheDocument()
  })

  it('shows total hours for all shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    expect(screen.getByText('Showing: 10 total hours')).toBeInTheDocument()
  })

  it('deletes a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await u.click(screen.getByRole('button', { name: 'Delete shift for Alice' }))
    expect(screen.queryByText('Alice — 6h')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 total hours')).toBeInTheDocument()
  })

  it('filters shifts by employee name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Alice — 6h')).toBeInTheDocument()
    expect(screen.queryByText('Bob — 4h')).not.toBeInTheDocument()
  })

  it('shows filtered total hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Alice', '3')
    await addShift(u, 'Bob', '4')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    expect(screen.getByText('Showing: 9 total hours')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByLabelText(/filter by employee/i)).toHaveValue('Alice')
    expect(screen.queryByText('Bob — 4h')).not.toBeInTheDocument()
  })

  it('Summary shows per-employee totals sorted alphabetically (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Bob', '4')
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Alice', '2')
    await nav(u, 'Summary')
    const items = screen.getAllByText(/: \d+h/)
    expect(items[0]).toHaveTextContent('Alice: 8h')
    expect(items[1]).toHaveTextContent('Bob: 4h')
  })

  it('Summary shows grand total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Grand total: 10h')).toBeInTheDocument()
  })

  it('Summary reflects deleted shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Alice', '4')
    await u.click(screen.getAllByRole('button', { name: 'Delete shift for Alice' })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 4h')).toBeInTheDocument()
    expect(screen.getByText('Grand total: 4h')).toBeInTheDocument()
  })

  it('Summary shows No shifts recorded after all shifts deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await u.click(screen.getByRole('button', { name: 'Delete shift for Alice' }))
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
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

  it('theme persists across views', async () => {
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

  it('shift list state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Carol', '8')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByText('Carol — 8h')).toBeInTheDocument()
  })

  it('All filter option restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Alice')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'All')
    expect(screen.getByText('Alice — 6h')).toBeInTheDocument()
    expect(screen.getByText('Bob — 4h')).toBeInTheDocument()
    expect(screen.getByText('Showing: 10 total hours')).toBeInTheDocument()
  })
})
