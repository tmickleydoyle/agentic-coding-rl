// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
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

describe('Staff Schedule app (held-out)', () => {
  it('shows correct Showing total for a single employee filter with multiple shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Eve', '5')
    await addShift(u, 'Eve', '3')
    await addShift(u, 'Frank', '10')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Eve')
    expect(screen.getByText('Showing: 8h')).toBeInTheDocument()
  })

  it('Shifts view Showing total is unaffected by Summary navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '6')
    await addShift(u, 'Bob', '4')
    await nav(u, 'Summary')
    await nav(u, 'Shifts')
    expect(screen.getByText('Showing: 10h')).toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Summary updates when a shift is added after viewing Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '8')
    await nav(u, 'Summary')
    expect(screen.getByText('Total hours: 8h')).toBeInTheDocument()
    await nav(u, 'Shifts')
    await addShift(u, 'Alice', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Total hours: 12h')).toBeInTheDocument()
    expect(screen.getByText('Alice: 12h')).toBeInTheDocument()
  })

  it('employee only appears once in filter dropdown even with many shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Grace', '4')
    await addShift(u, 'Grace', '4')
    await addShift(u, 'Grace', '4')
    const select = screen.getByLabelText(/filter by employee/i)
    const options = within(select as HTMLElement).getAllByRole('option')
    const graceOptions = options.filter((o) => o.textContent === 'Grace')
    expect(graceOptions.length).toBe(1)
  })

  it('after removing the only shift of an employee, they no longer appear in filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Hank', '6')
    await addShift(u, 'Ivy', '4')
    const hankItem = screen.getByText('Hank — 6h').closest('li') as HTMLElement
    await u.click(within(hankItem).getByRole('button', { name: /remove shift/i }))
    const select = screen.getByLabelText(/filter by employee/i)
    expect(within(select as HTMLElement).queryByRole('option', { name: 'Hank' })).not.toBeInTheDocument()
    expect(within(select as HTMLElement).getByRole('option', { name: 'Ivy' })).toBeInTheDocument()
  })

  it('filter does not hide other employees shifts when set to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Jack', '5')
    await addShift(u, 'Karen', '9')
    const select = screen.getByLabelText(/filter by employee/i)
    await u.selectOptions(select, 'Jack')
    await u.selectOptions(select, 'All')
    expect(screen.getByText('Jack — 5h')).toBeInTheDocument()
    expect(screen.getByText('Karen — 9h')).toBeInTheDocument()
    expect(screen.getByText('Showing: 14h')).toBeInTheDocument()
  })

  it('Summary shows correct employee count after removing all shifts of one employee', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Leo', '8')
    await addShift(u, 'Mia', '6')
    const leoItem = screen.getByText('Leo — 8h').closest('li') as HTMLElement
    await u.click(within(leoItem).getByRole('button', { name: /remove shift/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Employees: 1')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 6h')).toBeInTheDocument()
  })

  it('multiple employees each show correct hours in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Ned', '3')
    await addShift(u, 'Ned', '5')
    await addShift(u, 'Olivia', '7')
    await addShift(u, 'Olivia', '1')
    await nav(u, 'Summary')
    expect(screen.getByText('Ned: 8h')).toBeInTheDocument()
    expect(screen.getByText('Olivia: 8h')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 16h')).toBeInTheDocument()
    expect(screen.getByText('Employees: 2')).toBeInTheDocument()
  })
})
