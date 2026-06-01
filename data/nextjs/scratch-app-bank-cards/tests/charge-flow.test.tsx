import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('charge flow', () => {
  it('adds a charge to a card and updates its spend', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    await user.selectOptions(screen.getByTestId('card-select'), 'k1')
    await user.type(screen.getByTestId('merchant-input'), 'Lunch')
    await user.type(screen.getByTestId('amount-input'), '20')
    await user.click(screen.getByTestId('submit-charge'))
    expect(screen.getByTestId('charge-success')).toBeInTheDocument()

    await user.click(screen.getByTestId('nav-cards'))
    // k1 spent 100 -> 120
    expect(screen.getByTestId('card-k1-spent')).toHaveTextContent('120')
  })

  it('rejects a charge to a frozen card', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    await user.selectOptions(screen.getByTestId('card-select'), 'k3')
    await user.type(screen.getByTestId('amount-input'), '10')
    await user.click(screen.getByTestId('submit-charge'))
    expect(screen.getByTestId('charge-error')).toHaveTextContent('card frozen')
  })

  it('rejects a charge that exceeds the card limit', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    await user.selectOptions(screen.getByTestId('card-select'), 'k1')
    // k1 already spent 100 of 1000; 950 would push over
    await user.type(screen.getByTestId('amount-input'), '950')
    await user.click(screen.getByTestId('submit-charge'))
    expect(screen.getByTestId('charge-error')).toHaveTextContent('over limit')

    await user.click(screen.getByTestId('nav-cards'))
    expect(screen.getByTestId('card-k1-spent')).toHaveTextContent('100')
  })

  it('rejects a non-positive amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    await user.selectOptions(screen.getByTestId('card-select'), 'k1')
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.click(screen.getByTestId('submit-charge'))
    expect(screen.getByTestId('charge-error')).toHaveTextContent('amount must be positive')
  })

  it('allows a charge after raising the limit in settings', async () => {
    const user = userEvent.setup()
    render(<App />)
    // k3 is frozen but we can still raise its limit; first unfreeze it via detail
    await user.click(screen.getByTestId('card-k3-open'))
    await user.click(screen.getByTestId('freeze-toggle'))
    await user.click(screen.getByTestId('nav-settings'))
    const input = screen.getByTestId('limit-k3-input')
    await user.clear(input)
    await user.type(input, '800')
    await user.click(screen.getByTestId('limit-k3-save'))

    await user.click(screen.getByTestId('nav-transactions'))
    await user.selectOptions(screen.getByTestId('card-select'), 'k3')
    await user.type(screen.getByTestId('amount-input'), '700')
    await user.click(screen.getByTestId('submit-charge'))
    expect(screen.getByTestId('charge-success')).toBeInTheDocument()
  })
})
