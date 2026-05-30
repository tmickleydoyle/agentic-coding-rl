import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('my-tickets view', () => {
  it('lists the seeded order with its details', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-tickets'))
    expect(screen.getByTestId('order-o1-event')).toHaveTextContent('Synth Fest')
    expect(screen.getByTestId('order-o1-tier')).toHaveTextContent('GA')
    expect(screen.getByTestId('order-o1-qty')).toHaveTextContent('2')
    expect(screen.getByTestId('order-o1-buyer')).toHaveTextContent('Ada')
    expect(screen.getByTestId('order-o1-total')).toHaveTextContent('100')
  })

  it('shows seeded totals for ticket count and revenue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-tickets'))
    expect(screen.getByTestId('ticket-count')).toHaveTextContent('2')
    expect(screen.getByTestId('revenue-total')).toHaveTextContent('100')
  })
})
