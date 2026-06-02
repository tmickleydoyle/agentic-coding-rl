// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view paths.
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

describe('Staff Schedule (held-out)', () => {
  it('three employees each appear in the filter dropdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dana', '8')
    await addShift(u, 'Eve', '6')
    await addShift(u, 'Frank', '4')
    const select = screen.getByLabelText(/filter by employee/i)
    expect(within(select).getByRole('option', { name: 'Dana' })).toBeInTheDocument()
    expect(within(select).getByRole('option', { name: 'Eve' })).toBeInTheDocument()
    expect(within(select).getByRole('option', { name: 'Frank' })).toBeInTheDocument()
  })

  it('filtered total reflects multiple shifts for one employee', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dana', '8')
    await addShift(u, 'Dana', '4')
    await addShift(u, 'Eve', '10')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Dana')
    expect(screen.getByText('Total hours: 12')).toBeInTheDocument()
  })

  it('Summary shows per-employee totals across multiple shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'George', '5')
    await addShift(u, 'George', '3')
    await addShift(u, 'Hana', '7')
    await nav(u, 'Summary')
    expect(screen.getByText('George: 8 hrs')).toBeInTheDocument()
    expect(screen.getByText('Hana: 7 hrs')).toBeInTheDocument()
    expect(screen.getByText('Total shifts: 3')).toBeInTheDocument()
  })

  it('removing all shifts makes Summary show No shifts recorded again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Iris', '6')
    const removeBtn = screen.getByRole('button', { name: /remove shift/i })
    await u.click(removeBtn)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter by employee Eve shows only Eve shifts and correct total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Jack', '9')
    await addShift(u, 'Eve', '5')
    await addShift(u, 'Eve', '3')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Eve')
    expect(screen.queryByText('Jack — 9 hrs')).not.toBeInTheDocument()
    expect(screen.getByText('Eve — 5 hrs')).toBeInTheDocument()
    expect(screen.getByText('Eve — 3 hrs')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 8')).toBeInTheDocument()
  })

  it('inputs are cleared after adding a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Karen', '7')
    expect(screen.getByLabelText(/employee name/i)).toHaveValue('')
  })

  it('Summary total shifts count updates as shifts are added (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Leo', '8')
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 1')).toBeInTheDocument()
    await nav(u, 'Shifts')
    await addShift(u, 'Leo', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 2')).toBeInTheDocument()
    expect(screen.getByText('Leo: 12 hrs')).toBeInTheDocument()
  })
})
