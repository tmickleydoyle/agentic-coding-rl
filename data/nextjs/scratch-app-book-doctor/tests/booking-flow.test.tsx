import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('booking flow', () => {
  it('only offers unbooked slots for the selected provider', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-p1')) // 06-10 booked, 06-12 open
    const select = screen.getByTestId('slot-select') as HTMLSelectElement
    const values = Array.from(select.options).map((o) => o.value)
    expect(values).not.toContain('2026-06-10')
    expect(values).toContain('2026-06-12')
  })

  it('blocks booking with an empty patient name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-p1'))
    await user.click(screen.getByTestId('submit-appointment'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
  })

  it('books an appointment and shows it under upcoming', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-p1'))
    await user.type(screen.getByTestId('patient-input'), 'Linus')
    await user.click(screen.getByTestId('submit-appointment'))
    expect(screen.getByTestId('page-appointments')).toBeInTheDocument()
    const list = screen.getByTestId('upcoming-list')
    expect(within(list).getByText('Linus')).toBeInTheDocument()
    expect(within(list).getByText('2026-06-12')).toBeInTheDocument()
  })

  it('shows no-slots when a provider is fully booked', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Book p3's only slot first
    await user.click(screen.getByTestId('select-p3'))
    await user.type(screen.getByTestId('patient-input'), 'First')
    await user.click(screen.getByTestId('submit-appointment'))
    // Re-open p3 — now no slots
    await user.click(screen.getByTestId('nav-providers'))
    await user.click(screen.getByTestId('select-p3'))
    expect(screen.getByTestId('no-slots')).toBeInTheDocument()
    expect(screen.queryByTestId('appointment-form')).not.toBeInTheDocument()
  })

  it('cancels an upcoming appointment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-appointments'))
    expect(screen.getByTestId('appt-a1')).toBeInTheDocument()
    await user.click(screen.getByTestId('cancel-a1'))
    expect(screen.queryByTestId('appt-a1')).not.toBeInTheDocument()
  })

  it('shows the empty state when all upcoming appointments are cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-appointments'))
    await user.click(screen.getByTestId('cancel-a1'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('upcoming-list')).not.toBeInTheDocument()
  })
})
