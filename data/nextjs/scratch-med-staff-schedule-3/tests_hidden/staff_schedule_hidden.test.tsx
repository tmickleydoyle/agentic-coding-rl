// HELD-OUT generalization tests — used only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('Staff Schedule (held-out)', () => {
  it('multiple shifts for same employee accumulate in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dana', '4')
    await addShift(u, 'Dana', '5')
    await addShift(u, 'Dana', '3')
    await nav(u, 'Summary')
    expect(screen.getByText('Dana: 12h')).toBeInTheDocument()
    expect(screen.getByText('Grand total: 12h')).toBeInTheDocument()
  })

  it('Summary ignores the active filter and counts all shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Eve', '7')
    await addShift(u, 'Frank', '3')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Eve')
    await nav(u, 'Summary')
    expect(screen.getByText('Eve: 7h')).toBeInTheDocument()
    expect(screen.getByText('Frank: 3h')).toBeInTheDocument()
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

  it('filter dropdown lists each unique employee once', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Alice', '4')
    await addShift(u, 'Alice', '2')
    await addShift(u, 'Bob', '5')
    const select = screen.getByLabelText(/filter by employee/i) as HTMLSelectElement
    const optionValues = Array.from(select.options).map((o) => o.value)
    const aliceCount = optionValues.filter((v) => v === 'Alice').length
    const bobCount = optionValues.filter((v) => v === 'Bob').length
    expect(aliceCount).toBe(1)
    expect(bobCount).toBe(1)
  })

  it('Showing total is 0 when filter matches employee with no remaining shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Grace', '6')
    await addShift(u, 'Heidi', '3')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Grace')
    await u.click(screen.getByRole('button', { name: 'Delete shift for Grace' }))
    expect(screen.getByText('Showing: 0 total hours')).toBeInTheDocument()
  })

  it('input fields are cleared after adding a shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Ivan', '8')
    expect(screen.getByLabelText(/employee name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^hours$/i)).toHaveValue(null)
  })

  it('negative hours are rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Jane', '-5')
    expect(screen.getByText('Showing: 0 total hours')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('No shifts recorded')).toBeInTheDocument()
  })

  it('grand total updates correctly after a deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Karl', '5')
    await addShift(u, 'Lena', '7')
    await u.click(screen.getByRole('button', { name: 'Delete shift for Karl' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Grand total: 7h')).toBeInTheDocument()
    expect(screen.queryByText('Karl: 5h')).not.toBeInTheDocument()
  })
})
