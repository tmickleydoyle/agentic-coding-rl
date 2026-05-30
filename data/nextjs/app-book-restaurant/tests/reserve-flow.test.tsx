import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('reserve flow', () => {
  it('blocks reserving with an empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reserve'))
    await user.click(screen.getByTestId('submit-reserve'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-reserve')).toBeInTheDocument()
  })

  it('reserves a table and shows it in reservations', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reserve'))
    await user.type(screen.getByTestId('name-input'), 'Linus')
    await user.selectOptions(screen.getByTestId('table-select'), 't3')
    await user.selectOptions(screen.getByTestId('time-select'), '18:00')
    await user.click(screen.getByTestId('submit-reserve'))
    expect(screen.getByTestId('page-reservations')).toBeInTheDocument()
    const list = screen.getByTestId('reservations-list')
    expect(within(list).getByText('Linus')).toBeInTheDocument()
  })

  it('rejects a reservation that conflicts with an existing one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reserve'))
    await user.type(screen.getByTestId('name-input'), 'Clash')
    await user.selectOptions(screen.getByTestId('table-select'), 't1')
    await user.selectOptions(screen.getByTestId('time-select'), '19:00') // t1@19:00 taken
    await user.click(screen.getByTestId('submit-reserve'))
    expect(screen.getByTestId('conflict-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-reserve')).toBeInTheDocument()
  })

  it('rejects a reservation that exceeds table capacity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reserve'))
    await user.type(screen.getByTestId('name-input'), 'BigGroup')
    await user.selectOptions(screen.getByTestId('table-select'), 't1') // capacity 2
    await user.selectOptions(screen.getByTestId('time-select'), '18:00')
    await user.clear(screen.getByTestId('party-input'))
    await user.type(screen.getByTestId('party-input'), '4')
    await user.click(screen.getByTestId('submit-reserve'))
    expect(screen.getByTestId('conflict-error')).toBeInTheDocument()
  })

  it('cancels a reservation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reservations'))
    expect(screen.getByTestId('reservation-r1')).toBeInTheDocument()
    await user.click(screen.getByTestId('cancel-r1'))
    expect(screen.queryByTestId('reservation-r1')).not.toBeInTheDocument()
  })

  it('shows an empty state when all reservations are cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reservations'))
    await user.click(screen.getByTestId('cancel-r1'))
    await user.click(screen.getByTestId('cancel-r2'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('reservations-list')).not.toBeInTheDocument()
  })
})
