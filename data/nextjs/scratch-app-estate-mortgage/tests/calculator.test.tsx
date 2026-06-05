import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToCalc(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-calculator'))
}

describe('calculator', () => {
  it('computes a monthly payment from price/down/rate/term', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCalc(user)
    await user.clear(screen.getByTestId('price-input'))
    await user.type(screen.getByTestId('price-input'), '450000')
    await user.clear(screen.getByTestId('down-input'))
    await user.type(screen.getByTestId('down-input'), '90000')
    await user.clear(screen.getByTestId('rate-input'))
    await user.type(screen.getByTestId('rate-input'), '5')
    await user.clear(screen.getByTestId('term-input'))
    await user.type(screen.getByTestId('term-input'), '30')
    // P=360000, r=5%/12, n=360 => 1933
    expect(screen.getByTestId('monthly-payment')).toHaveTextContent('1933')
  })

  it('handles a zero interest rate with simple division', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCalc(user)
    await user.clear(screen.getByTestId('price-input'))
    await user.type(screen.getByTestId('price-input'), '320000')
    await user.clear(screen.getByTestId('rate-input'))
    await user.type(screen.getByTestId('rate-input'), '0')
    await user.clear(screen.getByTestId('term-input'))
    await user.type(screen.getByTestId('term-input'), '10')
    // 320000 / 120 = 2667 (rounded)
    expect(screen.getByTestId('monthly-payment')).toHaveTextContent('2667')
  })

  it('shows the total interest over the loan', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCalc(user)
    await user.clear(screen.getByTestId('price-input'))
    await user.type(screen.getByTestId('price-input'), '450000')
    await user.clear(screen.getByTestId('down-input'))
    await user.type(screen.getByTestId('down-input'), '90000')
    await user.clear(screen.getByTestId('rate-input'))
    await user.type(screen.getByTestId('rate-input'), '5')
    await user.clear(screen.getByTestId('term-input'))
    await user.type(screen.getByTestId('term-input'), '30')
    expect(screen.getByTestId('total-interest')).toHaveTextContent('335880')
  })

  it('a higher down payment lowers the monthly payment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCalc(user)
    await user.clear(screen.getByTestId('price-input'))
    await user.type(screen.getByTestId('price-input'), '400000')
    await user.clear(screen.getByTestId('rate-input'))
    await user.type(screen.getByTestId('rate-input'), '5')
    await user.clear(screen.getByTestId('term-input'))
    await user.type(screen.getByTestId('term-input'), '30')
    const before = Number(screen.getByTestId('monthly-payment').textContent)
    await user.clear(screen.getByTestId('down-input'))
    await user.type(screen.getByTestId('down-input'), '100000')
    const after = Number(screen.getByTestId('monthly-payment').textContent)
    expect(after).toBeLessThan(before)
  })
})
