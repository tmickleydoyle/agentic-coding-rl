import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Tip Calculator', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /tip calculator/i })).toBeInTheDocument()
  })

  it('shows $0.00 for all values when bill is empty', () => {
    render(<App />)
    expect(screen.getByTestId('tip-amount').textContent).toBe('$0.00')
    expect(screen.getByTestId('total-amount').textContent).toBe('$0.00')
    expect(screen.getByTestId('per-person').textContent).toBe('$0.00')
  })

  it('calculates tip, total, and per-person for a simple bill', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '100')
    // tip defaults to 15%
    expect(screen.getByTestId('tip-amount').textContent).toBe('$15.00')
    expect(screen.getByTestId('total-amount').textContent).toBe('$115.00')
    expect(screen.getByTestId('per-person').textContent).toBe('$115.00')
  })

  it('splits bill among multiple people', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '100')
    await user.clear(screen.getByLabelText(/number of people/i))
    await user.type(screen.getByLabelText(/number of people/i), '2')
    expect(screen.getByTestId('per-person').textContent).toBe('$57.50')
  })

  it('updates when tip percentage changes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '200')
    await user.clear(screen.getByLabelText(/tip percentage/i))
    await user.type(screen.getByLabelText(/tip percentage/i), '20')
    expect(screen.getByTestId('tip-amount').textContent).toBe('$40.00')
    expect(screen.getByTestId('total-amount').textContent).toBe('$240.00')
  })

  it('preset 15% button sets tip to 15', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '100')
    await user.click(screen.getByRole('button', { name: '15%' }))
    expect(screen.getByTestId('tip-amount').textContent).toBe('$15.00')
  })

  it('preset 20% button sets tip to 20', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '100')
    await user.click(screen.getByRole('button', { name: '20%' }))
    expect(screen.getByTestId('tip-amount').textContent).toBe('$20.00')
    expect(screen.getByTestId('total-amount').textContent).toBe('$120.00')
  })

  it('preset 25% button sets tip to 25', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '100')
    await user.click(screen.getByRole('button', { name: '25%' }))
    expect(screen.getByTestId('tip-amount').textContent).toBe('$25.00')
  })

  it('reset button clears bill and resets tip to 15 and people to 1', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '80')
    await user.clear(screen.getByLabelText(/number of people/i))
    await user.type(screen.getByLabelText(/number of people/i), '4')
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('tip-amount').textContent).toBe('$0.00')
    expect(screen.getByTestId('total-amount').textContent).toBe('$0.00')
    expect(screen.getByTestId('per-person').textContent).toBe('$0.00')
  })

  it('tip of 0% shows zero tip and total equals bill', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '50')
    await user.clear(screen.getByLabelText(/tip percentage/i))
    await user.type(screen.getByLabelText(/tip percentage/i), '0')
    expect(screen.getByTestId('tip-amount').textContent).toBe('$0.00')
    expect(screen.getByTestId('total-amount').textContent).toBe('$50.00')
  })

  it('handles decimal bill amounts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '33.33')
    await user.clear(screen.getByLabelText(/tip percentage/i))
    await user.type(screen.getByLabelText(/tip percentage/i), '10')
    expect(screen.getByTestId('tip-amount').textContent).toBe('$3.33')
    expect(screen.getByTestId('total-amount').textContent).toBe('$36.66')
  })

  it('people < 1 treated as 1', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/bill amount/i))
    await user.type(screen.getByLabelText(/bill amount/i), '100')
    await user.clear(screen.getByLabelText(/number of people/i))
    await user.type(screen.getByLabelText(/number of people/i), '0')
    expect(screen.getByTestId('per-person').textContent).toBe('$115.00')
  })
})
