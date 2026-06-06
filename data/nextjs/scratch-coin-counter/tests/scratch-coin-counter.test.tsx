import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Coin Counter', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /coin counter/i })).toBeTruthy()
  })

  it('renders all coin inputs', () => {
    expect(screen.getByTestId('input-pennies')).toBeTruthy()
    expect(screen.getByTestId('input-nickels')).toBeTruthy()
    expect(screen.getByTestId('input-dimes')).toBeTruthy()
    expect(screen.getByTestId('input-quarters')).toBeTruthy()
    expect(screen.getByTestId('input-half-dollars')).toBeTruthy()
    expect(screen.getByTestId('input-dollar-coins')).toBeTruthy()
  })

  it('starts with total of $0.00', () => {
    expect(screen.getByTestId('total-dollars').textContent).toContain('$0.00')
    expect(screen.getByTestId('total-cents').textContent).toContain('0')
  })

  it('updates total when pennies are entered', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('input-pennies'))
    await user.type(screen.getByTestId('input-pennies'), '5')
    expect(screen.getByTestId('total-cents').textContent).toContain('5')
    expect(screen.getByTestId('total-dollars').textContent).toContain('$0.05')
  })

  it('updates subtotal for quarters', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('input-quarters'))
    await user.type(screen.getByTestId('input-quarters'), '4')
    expect(screen.getByTestId('subtotal-quarters').textContent).toContain('100¢')
  })

  it('computes total across multiple denominations', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('input-dimes'))
    await user.type(screen.getByTestId('input-dimes'), '10')
    await user.clear(screen.getByTestId('input-nickels'))
    await user.type(screen.getByTestId('input-nickels'), '2')
    // 100 + 10 = 110 cents
    expect(screen.getByTestId('total-cents').textContent).toContain('110')
    expect(screen.getByTestId('total-dollars').textContent).toContain('$1.10')
  })

  it('resets all quantities to 0', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('input-pennies'))
    await user.type(screen.getByTestId('input-pennies'), '10')
    await user.click(screen.getByTestId('reset-btn'))
    expect(screen.getByTestId('total-dollars').textContent).toContain('$0.00')
    const input = screen.getByTestId('input-pennies') as HTMLInputElement
    expect(input.value).toBe('0')
  })

  it('shows subtotal for half-dollars', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('input-half-dollars'))
    await user.type(screen.getByTestId('input-half-dollars'), '3')
    expect(screen.getByTestId('subtotal-half-dollars').textContent).toContain('150¢')
  })

  it('dollar-coins subtotal is correct', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('input-dollar-coins'))
    await user.type(screen.getByTestId('input-dollar-coins'), '2')
    expect(screen.getByTestId('subtotal-dollar-coins').textContent).toContain('200¢')
    expect(screen.getByTestId('total-dollars').textContent).toContain('$2.00')
  })

  it('count btn is present and clickable', async () => {
    const user = userEvent.setup()
    const btn = screen.getByTestId('count-btn')
    expect(btn).toBeTruthy()
    await user.click(btn)
    expect(screen.getByTestId('total-dollars').textContent).toContain('$0.00')
  })

  it('all subtotals start at 0¢', () => {
    const keys = ['pennies', 'nickels', 'dimes', 'quarters', 'half-dollars', 'dollar-coins']
    keys.forEach(k => {
      expect(screen.getByTestId(`subtotal-${k}`).textContent).toContain('0¢')
    })
  })

  it('renders reset button', () => {
    expect(screen.getByTestId('reset-btn')).toBeTruthy()
  })
})
