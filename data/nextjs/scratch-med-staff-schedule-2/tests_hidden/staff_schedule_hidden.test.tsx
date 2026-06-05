// HELD-OUT generalization tests — fresh scenarios used only at eval.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  it('visible total is 0h on first render', () => {
    render(<App />)
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })

  it('ignores a negative hours value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/employee name/i), 'Zara')
    await u.clear(screen.getByLabelText(/^hours$/i))
    await u.type(screen.getByLabelText(/^hours$/i), '-3')
    await u.click(screen.getByRole('button', { name: /add shift/i }))
    expect(screen.getByText('Visible total: 0h')).toBeInTheDocument()
  })

  it('adding two shifts for the same employee shows both rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Helen', '4')
    await addShift(u, 'Helen', '5')
    const rows = screen.getAllByText(/Helen/)
    expect(rows.length).toBeGreaterThanOrEqual(2)
  })

  it('filter dropdown contains added employee names', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Ivan', '7')
    await addShift(u, 'Julia', '6')
    const select = screen.getByLabelText(/filter by employee/i) as HTMLSelectElement
    const options = Array.from(select.options).map((o) => o.value)
    expect(options).toContain('Ivan')
    expect(options).toContain('Julia')
  })

  it('filtering by employee updates visible total to only their hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Kim', '5')
    await addShift(u, 'Kim', '3')
    await addShift(u, 'Leo', '10')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Kim')
    expect(screen.getByText('Visible total: 8h')).toBeInTheDocument()
  })

  it('deleting one of two shifts for an employee updates total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Mia', '4')
    await addShift(u, 'Mia', '6')
    const deleteButtons = screen.getAllByRole('button', { name: /delete shift/i })
    await u.click(deleteButtons[0])
    expect(screen.getByText('Visible total: 6h')).toBeInTheDocument()
  })

  it('Summary shows No shifts recorded after all shifts are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Nina', '8')
    const deleteBtn = screen.getByRole('button', { name: /delete shift/i })
    await u.click(deleteBtn)
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('Summary total employees counts distinct employees only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Oscar', '4')
    await addShift(u, 'Oscar', '4')
    await addShift(u, 'Paula', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Total employees: 2')).toBeInTheDocument()
  })

  it('grand total reflects a newly added shift cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Quinn', '6')
    await nav(u, 'Summary')
    expect(screen.getByText('Grand total: 6h')).toBeInTheDocument()
    await nav(u, 'Shifts')
    await addShift(u, 'Quinn', '4')
    await nav(u, 'Summary')
    expect(screen.getByText('Grand total: 10h')).toBeInTheDocument()
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

  it('shifts list is empty after deleting the only entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Rosa', '9')
    const deleteBtn = screen.getByRole('button', { name: /delete shift/i })
    await u.click(deleteBtn)
    expect(screen.queryByText('Rosa — 9h')).not.toBeInTheDocument()
  })
})
