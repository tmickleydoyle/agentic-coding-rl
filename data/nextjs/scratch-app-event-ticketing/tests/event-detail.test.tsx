import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('event detail view', () => {
  it('shows tier remaining capacity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    // GA t1: 100 cap - 20 sold = 80
    expect(screen.getByTestId('tier-t1-remaining')).toHaveTextContent('80')
    expect(screen.getByTestId('tier-t1-price')).toHaveTextContent('50')
  })

  it('marks a sold-out tier and hides its buy button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    // VIP t2: 10 of 10 sold -> sold out
    expect(screen.getByTestId('tier-t2-soldout')).toBeInTheDocument()
    expect(screen.queryByTestId('buy-t2')).not.toBeInTheDocument()
    expect(screen.getByTestId('tier-t2-remaining')).toHaveTextContent('0')
  })

  it('shows a buy button for an available tier', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    expect(screen.getByTestId('buy-t1')).toBeInTheDocument()
    await user.click(screen.getByTestId('buy-t1'))
    expect(screen.getByTestId('page-checkout')).toBeInTheDocument()
  })
})
