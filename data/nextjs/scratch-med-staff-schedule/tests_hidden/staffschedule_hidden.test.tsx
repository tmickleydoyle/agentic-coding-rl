// HELD-OUT generalization tests — used only at eval, never seen during development.
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
  it('starts with empty summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total hours: 0')).toBeInTheDocument()
    expect(screen.getByText('Employees: 0')).toBeInTheDocument()
  })

  it('three distinct employees appear in summary with correct hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Fiona', '9')
    await addShift(u, 'George', '5')
    await addShift(u, 'Hannah', '3')
    await nav(u, 'Summary')
    expect(screen.getByText('Fiona: 9 hrs')).toBeInTheDocument()
    expect(screen.getByText('George: 5 hrs')).toBeInTheDocument()
    expect(screen.getByText('Hannah: 3 hrs')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 17')).toBeInTheDocument()
    expect(screen.getByText('Employees: 3')).toBeInTheDocument()
  })

  it('filter shows only the selected employee shifts and hides others', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Ivan', '6')
    await addShift(u, 'Judy', '4')
    await addShift(u, 'Ivan', '2')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Ivan')
    expect(screen.getByText('Showing: 2 shifts')).toBeInTheDocument()
    expect(screen.getByText('Ivan — 6 hrs')).toBeInTheDocument()
    expect(screen.getByText('Ivan — 2 hrs')).toBeInTheDocument()
    expect(screen.queryByText('Judy — 4 hrs')).not.toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
  })

  it('removing all shifts resets summary to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Karl', '8')
    await addShift(u, 'Lena', '7')
    const removeBtns = screen.getAllByRole('button', { name: /remove shift/i })
    await u.click(removeBtns[0])
    const removeBtns2 = screen.getAllByRole('button', { name: /remove shift/i })
    await u.click(removeBtns2[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total hours: 0')).toBeInTheDocument()
    expect(screen.getByText('Employees: 0')).toBeInTheDocument()
  })

  it('shift rows use em dash format', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Mona', '10')
    expect(screen.getByText('Mona — 10 hrs')).toBeInTheDocument()
  })

  it('Showing count updates after adding a second shift', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Nina', '5')
    expect(screen.getByText('Showing: 1 shifts')).toBeInTheDocument()
    await addShift(u, 'Omar', '3')
    expect(screen.getByText('Showing: 2 shifts')).toBeInTheDocument()
  })

  it('Summary reflects newly added shift without page reload', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Paul', '12')
    await nav(u, 'Summary')
    expect(screen.getByText('Paul: 12 hrs')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 12')).toBeInTheDocument()
    await nav(u, 'Shifts')
    await addShift(u, 'Paul', '3')
    await nav(u, 'Summary')
    expect(screen.getByText('Paul: 15 hrs')).toBeInTheDocument()
    expect(screen.getByText('Total hours: 15')).toBeInTheDocument()
  })
})
