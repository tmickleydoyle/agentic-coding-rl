import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('card detail', () => {
  it('shows the selected card charges and figures', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('card-k1-open'))
    expect(screen.getByTestId('card-limit')).toHaveTextContent('1000')
    expect(screen.getByTestId('card-spent')).toHaveTextContent('100')
    expect(screen.getByTestId('card-remaining')).toHaveTextContent('900')
    expect(screen.getByTestId('charge-h1-merchant')).toHaveTextContent('Coffee Co')
    // h3 belongs to k2 and should not appear
    expect(screen.queryByTestId('charge-h3')).not.toBeInTheDocument()
  })

  it('freezes and unfreezes the card', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('card-k1-open'))
    expect(screen.getByTestId('freeze-state')).toHaveTextContent('active')
    await user.click(screen.getByTestId('freeze-toggle'))
    expect(screen.getByTestId('freeze-state')).toHaveTextContent('frozen')

    await user.click(screen.getByTestId('nav-cards'))
    // frozen count goes 1 -> 2
    expect(screen.getByTestId('stat-frozen-value')).toHaveTextContent('2')
  })

  it('shows no-charges for a card with no charges', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('card-k3-open'))
    expect(screen.getByTestId('no-charges')).toBeInTheDocument()
    expect(screen.queryByTestId('charge-list')).not.toBeInTheDocument()
  })

  it('shows no-selection when navigated directly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-card-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})
