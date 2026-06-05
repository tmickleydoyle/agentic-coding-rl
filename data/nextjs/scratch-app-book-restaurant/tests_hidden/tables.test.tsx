import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('tables view', () => {
  it('lists all tables with capacities', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tables'))
    expect(screen.getByTestId('table-t1-name')).toHaveTextContent('T1 Window')
    expect(screen.getByTestId('table-t1-capacity')).toHaveTextContent('2')
    expect(screen.getByTestId('table-t3-capacity')).toHaveTextContent('6')
  })

  it('shows the reservation count per table from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tables'))
    expect(screen.getByTestId('table-t1-reservations')).toHaveTextContent('1')
    expect(screen.getByTestId('table-t2-reservations')).toHaveTextContent('1')
    expect(screen.getByTestId('table-t3-reservations')).toHaveTextContent('0')
  })

  it('updates the reservation count after a new reservation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reserve'))
    await user.type(screen.getByTestId('name-input'), 'Edsger')
    await user.selectOptions(screen.getByTestId('table-select'), 't3')
    await user.selectOptions(screen.getByTestId('time-select'), '21:00')
    await user.click(screen.getByTestId('submit-reserve'))
    await user.click(screen.getByTestId('nav-tables'))
    expect(screen.getByTestId('table-t3-reservations')).toHaveTextContent('1')
  })
})
