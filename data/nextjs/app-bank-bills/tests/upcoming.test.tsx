import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('upcoming page', () => {
  it('lists upcoming bills sorted by due day', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-upcoming'))
    const list = screen.getByTestId('upcoming-list')
    const items = within(list).getAllByTestId(/^upcoming-b\d+$/)
    // b3 (due 15) before b4 (due 20); b1 is overdue, b2 is paid
    expect(items.map((el) => el.getAttribute('data-testid'))).toEqual([
      'upcoming-b3',
      'upcoming-b4',
    ])
  })

  it('lists overdue bills separately', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-upcoming'))
    expect(screen.getByTestId('overdue-b1')).toBeInTheDocument()
    expect(screen.getByTestId('overdue-b1-name')).toHaveTextContent('Rent')
    expect(screen.queryByTestId('overdue-b3')).not.toBeInTheDocument()
  })

  it('paying an overdue bill clears it from the overdue list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('bill-b1-open'))
    await user.click(screen.getByTestId('pay-button'))
    await user.click(screen.getByTestId('nav-upcoming'))
    expect(screen.getByTestId('empty-overdue')).toBeInTheDocument()
  })
})
