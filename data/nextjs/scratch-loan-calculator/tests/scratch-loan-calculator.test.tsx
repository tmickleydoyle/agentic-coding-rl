import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Loan Calculator', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /loan calculator/i })).toBeInTheDocument()
  })

  it('shows $0.00 for all values initially', () => {
    render(<App />)
    expect(screen.getByTestId('monthly-payment').textContent).toBe('$0.00')
    expect(screen.getByTestId('total-payment').textContent).toBe('$0.00')
    expect(screen.getByTestId('total-interest').textContent).toBe('$0.00')
  })

  it('calculates monthly payment for a standard loan', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Loan Amount'), '100000')
    await user.type(screen.getByLabelText('Annual Interest Rate'), '5')
    await user.type(screen.getByLabelText('Loan Term'), '30')
    // Monthly payment for $100k at 5% for 30 years ≈ $536.82
    const monthly = parseFloat(
      screen.getByTestId('monthly-payment').textContent!.replace('$', '')
    )
    expect(monthly).toBeGreaterThan(536)
    expect(monthly).toBeLessThan(538)
  })

  it('calculates total payment correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Loan Amount'), '100000')
    await user.type(screen.getByLabelText('Annual Interest Rate'), '5')
    await user.type(screen.getByLabelText('Loan Term'), '30')
    const total = parseFloat(
      screen.getByTestId('total-payment').textContent!.replace('$', '')
    )
    // 30 years = 360 payments
    expect(total).toBeGreaterThan(193000)
    expect(total).toBeLessThan(194000)
  })

  it('calculates total interest correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Loan Amount'), '100000')
    await user.type(screen.getByLabelText('Annual Interest Rate'), '5')
    await user.type(screen.getByLabelText('Loan Term'), '30')
    const interest = parseFloat(
      screen.getByTestId('total-interest').textContent!.replace('$', '')
    )
    expect(interest).toBeGreaterThan(93000)
    expect(interest).toBeLessThan(94000)
  })

  it('handles zero interest rate', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Loan Amount'), '12000')
    await user.type(screen.getByLabelText('Annual Interest Rate'), '0')
    await user.type(screen.getByLabelText('Loan Term'), '1')
    // 12000 / 12 = 1000.00
    expect(screen.getByTestId('monthly-payment').textContent).toBe('$1000.00')
    expect(screen.getByTestId('total-interest').textContent).toBe('$0.00')
  })

  it('updates live when inputs change', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Loan Amount'), '50000')
    await user.type(screen.getByLabelText('Annual Interest Rate'), '4')
    await user.type(screen.getByLabelText('Loan Term'), '10')
    const m1 = screen.getByTestId('monthly-payment').textContent
    await user.clear(screen.getByLabelText('Loan Amount'))
    await user.type(screen.getByLabelText('Loan Amount'), '100000')
    const m2 = screen.getByTestId('monthly-payment').textContent
    expect(m1).not.toBe(m2)
  })

  it('shows $0.00 when loan amount is empty', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Annual Interest Rate'), '5')
    await user.type(screen.getByLabelText('Loan Term'), '30')
    expect(screen.getByTestId('monthly-payment').textContent).toBe('$0.00')
  })

  it('shows $0.00 when term is 0', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Loan Amount'), '100000')
    await user.type(screen.getByLabelText('Annual Interest Rate'), '5')
    await user.type(screen.getByLabelText('Loan Term'), '0')
    expect(screen.getByTestId('monthly-payment').textContent).toBe('$0.00')
  })

  it('reset button clears all fields and shows $0.00', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Loan Amount'), '100000')
    await user.type(screen.getByLabelText('Annual Interest Rate'), '5')
    await user.type(screen.getByLabelText('Loan Term'), '30')
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('monthly-payment').textContent).toBe('$0.00')
    expect(screen.getByTestId('total-payment').textContent).toBe('$0.00')
    expect(screen.getByTestId('total-interest').textContent).toBe('$0.00')
  })

  it('calculates a short-term loan correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Loan Amount'), '6000')
    await user.type(screen.getByLabelText('Annual Interest Rate'), '6')
    await user.type(screen.getByLabelText('Loan Term'), '1')
    // monthly ≈ $516.57
    const monthly = parseFloat(
      screen.getByTestId('monthly-payment').textContent!.replace('$', '')
    )
    expect(monthly).toBeGreaterThan(516)
    expect(monthly).toBeLessThan(518)
  })
})
