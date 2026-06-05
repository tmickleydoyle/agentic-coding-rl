import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAppt(u: U, customer: string, service: string, status?: string) {
  await u.clear(screen.getByLabelText('Customer'))
  await u.type(screen.getByLabelText('Customer'), customer)
  await u.clear(screen.getByLabelText('Service'))
  await u.type(screen.getByLabelText('Service'), service)
  if (status) {
    await u.selectOptions(screen.getByLabelText('Status'), status)
  }
  await u.click(screen.getByRole('button', { name: /add appointment/i }))
}

function apptRow(customer: string): HTMLElement {
  const el = screen.getByText(customer)
  const li = el.closest('li')
  if (!li) throw new Error(`no row for ${customer}`)
  return li as HTMLElement
}

describe('Appointment Book (held-out)', () => {
  it('adding multiple appointments increments Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Anna', 'Cut')
    await addAppt(u, 'Ben', 'Color')
    await addAppt(u, 'Cara', 'Trim')
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('filter no-show shows 0 of N when none have that status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Dana', 'Wax', 'booked')
    await addAppt(u, 'Eli', 'Facial', 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'no-show')
    expect(screen.getByText('Showing: 0 of 2')).toBeInTheDocument()
  })

  it('marking done does not change total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Faye', 'Cut', 'booked')
    await u.click(within(apptRow('Faye')).getByRole('button', { name: /mark done/i }))
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('marking already-done appointment keeps it as done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Glen', 'Nails', 'done')
    await u.click(within(apptRow('Glen')).getByRole('button', { name: /mark done/i }))
    expect(within(apptRow('Glen')).getByText('done')).toBeInTheDocument()
  })

  it('Summary completion is 100% when all are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Hal', 'Cut', 'done')
    await addAppt(u, 'Ida', 'Color', 'done')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('Summary counts no-shows correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Joe', 'Trim', 'no-show')
    await addAppt(u, 'Kim', 'Wax', 'no-show')
    await addAppt(u, 'Lena', 'Facial', 'booked')
    await nav(u, 'Summary')
    expect(screen.getByText('No-show: 2')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('filter still shows correct M total after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Max', 'Cut', 'booked')
    await addAppt(u, 'Nora', 'Color', 'done')
    await addAppt(u, 'Omar', 'Trim', 'booked')
    await u.click(within(apptRow('Max')).getByRole('button', { name: /delete/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByText('Theme: light')).toBeInTheDocument()
  })

  it('deleting all appointments resets Summary to zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Pia', 'Facial', 'done')
    await u.click(within(apptRow('Pia')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Booked: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('No-show: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('mark done updates Summary cross-view for multiple items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Rex', 'Cut', 'booked')
    await addAppt(u, 'Sue', 'Color', 'booked')
    await addAppt(u, 'Tom', 'Trim', 'booked')
    await u.click(within(apptRow('Rex')).getByRole('button', { name: /mark done/i }))
    await u.click(within(apptRow('Sue')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Booked: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('filter booked count updates after mark done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAppt(u, 'Una', 'Wax', 'booked')
    await addAppt(u, 'Val', 'Nails', 'booked')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'booked')
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
    await u.click(within(apptRow('Una')).getByRole('button', { name: /mark done/i }))
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
  })
})
