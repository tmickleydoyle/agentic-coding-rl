// HELD-OUT generalization tests — different inputs, edge cases, and cross-view sequences.
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
  it('initial total hours is 0', () => {
    render(<App />)
    expect(screen.getByText('Total hours: 0h')).toBeInTheDocument()
  })

  it('adding three shifts sums correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Eve', '6')
    await addShift(u, 'Eve', '6')
    await addShift(u, 'Eve', '6')
    expect(screen.getByText('Total hours: 18h')).toBeInTheDocument()
  })

  it('filter by a second employee shows only their shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await addShift(u, 'Bob', '5')
    await addShift(u, 'Carol', '4')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Bob')
    expect(screen.queryByText('Alice — 8h')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol — 4h')).not.toBeInTheDocument()
    expect(screen.getByText('Bob — 5h')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 5h')).toBeInTheDocument()
  })

  it('fractional shift totals display with one decimal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '4.5')
    await addShift(u, 'Alice', '3')
    await nav(u, 'Summary')
    expect(screen.getByText('Alice: 7.5h')).toBeInTheDocument()
    expect(screen.getByText('Grand total: 7.5h')).toBeInTheDocument()
  })

  it('grand total in Summary sums all employees', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Frank', '10')
    await addShift(u, 'Grace', '8')
    await addShift(u, 'Frank', '2')
    await nav(u, 'Summary')
    expect(screen.getByText('Frank: 12h')).toBeInTheDocument()
    expect(screen.getByText('Grace: 8h')).toBeInTheDocument()
    expect(screen.getByText('Grand total: 20h')).toBeInTheDocument()
  })

  it('Summary updates after adding shifts via cross-view flow', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Hank', '8')
    await nav(u, 'Summary')
    expect(screen.getByText('Hank: 8h')).toBeInTheDocument()
    await nav(u, 'Shifts')
    await addShift(u, 'Hank', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Hank: 12h')).toBeInTheDocument()
    expect(screen.getByText('Grand total: 12h')).toBeInTheDocument()
  })

  it('Summary shows No shifts recorded after all removed cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Ivan', '8')
    await addShift(u, 'Ivan', '4')
    const btns = screen.getAllByRole('button', { name: /remove shift/i })
    await u.click(btns[0])
    await u.click(screen.getByRole('button', { name: /remove shift/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('filter total only counts visible employee hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Jan', '8')
    await addShift(u, 'Jan', '4')
    await addShift(u, 'Kim', '10')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Jan')
    expect(screen.getByText('Total hours: 12h')).toBeInTheDocument()
  })

  it('All employees option in dropdown shows all shifts after filtering', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Leo', '6')
    await addShift(u, 'Mia', '5')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Leo')
    expect(screen.queryByText('Mia — 5h')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'All employees')
    expect(screen.getByText('Leo — 6h')).toBeInTheDocument()
    expect(screen.getByText('Mia — 5h')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 11h')).toBeInTheDocument()
  })
})
