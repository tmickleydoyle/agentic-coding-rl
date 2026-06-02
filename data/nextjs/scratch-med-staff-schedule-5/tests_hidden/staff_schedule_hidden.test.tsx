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

describe('Staff Schedule (held-out)', () => {
  it('adds two shifts for the same employee and totals them in Shifts view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Dana', '6')
    await addShift(u, 'Dana', '4')
    expect(screen.getByText('Showing total: 10 hrs')).toBeInTheDocument()
  })

  it('filter by employee total equals their Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Eve', '5')
    await addShift(u, 'Eve', '3')
    await addShift(u, 'Frank', '9')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Eve')
    expect(screen.getByText('Showing total: 8 hrs')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Eve: 8 hrs')).toBeInTheDocument()
    expect(screen.getByText('Frank: 9 hrs')).toBeInTheDocument()
  })

  it('Summary employees are sorted A-Z', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Zara', '4')
    await addShift(u, 'Anna', '6')
    await addShift(u, 'Mike', '3')
    await nav(u, 'Summary')
    const section = screen.getByRole('region', { name: /summary view/i })
    const paras = within(section).getAllByText(/hrs$/)
    const names = paras.map((p) => p.textContent?.split(':')[0])
    expect(names).toEqual(['Anna', 'Mike', 'Zara'])
  })

  it('removing a shift while filtered recalculates total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Grace', '8')
    await addShift(u, 'Grace', '4')
    await addShift(u, 'Hank', '7')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Grace')
    const removeBtns = screen.getAllByRole('button', { name: /remove shift/i })
    await u.click(removeBtns[0])
    expect(screen.getByText('Showing total: 4 hrs')).toBeInTheDocument()
  })

  it('Summary total hours reflects all shifts including those by filtered-out employees', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Ivan', '10')
    await addShift(u, 'Judy', '5')
    await u.selectOptions(screen.getByLabelText(/filter by employee/i), 'Ivan')
    await nav(u, 'Summary')
    expect(screen.getByText('Total hours: 15')).toBeInTheDocument()
    expect(screen.getByText('Total shifts: 2')).toBeInTheDocument()
  })

  it('theme toggle changes dark to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter dropdown only lists unique employee names', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addShift(u, 'Leo', '4')
    await addShift(u, 'Leo', '6')
    await addShift(u, 'Mia', '5')
    const select = screen.getByLabelText(/filter by employee/i)
    const options = within(select as HTMLElement).getAllByRole('option')
    const names = options.map((o) => o.textContent)
    const leoOccurrences = names.filter((n) => n === 'Leo').length
    expect(leoOccurrences).toBe(1)
  })
})
