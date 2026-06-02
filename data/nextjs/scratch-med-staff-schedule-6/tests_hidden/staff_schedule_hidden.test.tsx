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
  it('adding three shifts for two employees shows correct visible total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dana', '5')
    await addShift(u, 'Eve', '3')
    await addShift(u, 'Dana', '7')
    expect(screen.getByText('Visible total: 15h')).toBeInTheDocument()
  })

  it('filtering by second employee shows only their shifts and correct total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dana', '5')
    await addShift(u, 'Eve', '3')
    await addShift(u, 'Dana', '7')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Eve')
    expect(screen.queryByText('Dana — 5h')).not.toBeInTheDocument()
    expect(screen.getByText('Eve — 3h')).toBeInTheDocument()
    expect(screen.getByText('Visible total: 3h')).toBeInTheDocument()
  })

  it('per-employee summary sums multiple shifts correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dana', '5')
    await addShift(u, 'Eve', '3')
    await addShift(u, 'Dana', '7')
    await nav(u, 'Summary')
    expect(screen.getByText('Dana: 12h')).toBeInTheDocument()
    expect(screen.getByText('Eve: 3h')).toBeInTheDocument()
  })

  it('summary total shifts count updates after deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dana', '5')
    await addShift(u, 'Eve', '3')
    await addShift(u, 'Dana', '7')
    // delete the first shift (Dana 5h)
    const deleteButtons = screen.getAllByRole('button', { name: /delete shift/i })
    await u.click(deleteButtons[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total shifts: 2')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 10h')).toBeInTheDocument()
    expect(screen.getByText('Dana: 7h')).toBeInTheDocument()
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

  it('negative hours are ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/employee name/i), 'Frank')
    await u.type(screen.getByLabelText(/^hours$/i), '-3')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })

  it('filter dropdown does not list duplicate employee names', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Grace', '4')
    await addShift(u, 'Grace', '6')
    const select = screen.getByLabelText(/filter by employee/i)
    const options = within(select as HTMLElement).getAllByRole('option', { name: 'Grace' })
    expect(options).toHaveLength(1)
  })

  it('no shifts recorded disappears once a shift is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
    await nav(u, 'Shifts')
    await addShift(u, 'Hana', '5')
    await nav(u, 'Summary')
    expect(screen.queryByText('No shifts recorded')).not.toBeInTheDocument()
    expect(screen.getByText('Total shifts: 1')).toBeInTheDocument()
  })

  it('visible total when filtered by an employee with multiple shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Ivan', '3')
    await addShift(u, 'Ivan', '5')
    await addShift(u, 'Jana', '8')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Ivan')
    expect(screen.getByText('Visible total: 8h')).toBeInTheDocument()
  })

  it('input fields are cleared after adding a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Karl', '6')
    expect(screen.getByLabelText(/employee name/i)).toHaveValue('')
    const hoursInput = screen.getByLabelText(/^hours$/i) as HTMLInputElement
    expect(hoursInput.value).toBe('')
  })
})
