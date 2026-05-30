import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('checkout flow', () => {
  it('shows no-event on checkout without a selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('no-event')).toBeInTheDocument()
  })

  it('blocks buying with an empty buyer name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    await user.click(screen.getByTestId('buy-t1'))
    await user.click(screen.getByTestId('submit-buy'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-checkout')).toBeInTheDocument()
  })

  it('buys tickets and shows them in my-tickets', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    await user.click(screen.getByTestId('buy-t1'))
    await user.type(screen.getByTestId('buyer-input'), 'Linus')
    await user.clear(screen.getByTestId('qty-input'))
    await user.type(screen.getByTestId('qty-input'), '3')
    await user.click(screen.getByTestId('submit-buy'))
    expect(screen.getByTestId('page-my-tickets')).toBeInTheDocument()
    const list = screen.getByTestId('orders-list')
    expect(within(list).getByText('Linus')).toBeInTheDocument()
  })

  it('rejects buying more than the remaining capacity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    await user.click(screen.getByTestId('buy-t1'))
    await user.type(screen.getByTestId('buyer-input'), 'Greedy')
    await user.clear(screen.getByTestId('qty-input'))
    await user.type(screen.getByTestId('qty-input'), '999')
    await user.click(screen.getByTestId('submit-buy'))
    expect(screen.getByTestId('sold-out-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-checkout')).toBeInTheDocument()
  })

  it('reflects the purchased qty in ticket count and revenue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    await user.click(screen.getByTestId('buy-t1'))
    await user.type(screen.getByTestId('buyer-input'), 'Edsger')
    await user.clear(screen.getByTestId('qty-input'))
    await user.type(screen.getByTestId('qty-input'), '2')
    await user.click(screen.getByTestId('submit-buy'))
    // seed: o1 qty 2 total 100; new: qty 2 @ 50 = total 100
    expect(screen.getByTestId('ticket-count')).toHaveTextContent('4')
    expect(screen.getByTestId('revenue-total')).toHaveTextContent('200')
  })

  it('decrements remaining capacity after a purchase', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    await user.click(screen.getByTestId('buy-t1'))
    await user.type(screen.getByTestId('buyer-input'), 'Buyer')
    await user.clear(screen.getByTestId('qty-input'))
    await user.type(screen.getByTestId('qty-input'), '5')
    await user.click(screen.getByTestId('submit-buy'))
    await user.click(screen.getByTestId('nav-event-detail'))
    // 80 remaining - 5 = 75
    expect(screen.getByTestId('tier-t1-remaining')).toHaveTextContent('75')
  })
})
