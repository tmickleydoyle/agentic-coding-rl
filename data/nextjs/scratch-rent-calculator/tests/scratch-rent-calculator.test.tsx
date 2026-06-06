import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Rent Calculator', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /rent calculator/i })).toBeInTheDocument()
  })

  it('hides results on initial load', () => {
    render(<App />)
    expect(screen.queryByTestId('total-cost')).not.toBeInTheDocument()
  })

  it('shows results after clicking Calculate', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    expect(screen.getByTestId('total-cost')).toBeInTheDocument()
  })

  it('calculates total monthly cost correctly from defaults', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    // 1400+150+75+0+20 = 1645
    expect(screen.getByTestId('total-cost').textContent).toBe('Total Monthly Cost: $1645')
  })

  it('calculates rent-to-income ratio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    // 1400/5000 * 100 = 28.0%
    expect(screen.getByTestId('income-ratio').textContent).toBe('Rent-to-Income Ratio: 28.0%')
  })

  it('shows Affordable when ratio <= 30%', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    expect(screen.getByTestId('affordability').textContent).toBe('Affordability: Affordable')
  })

  it('shows Borderline when ratio is between 30% and 40%', async () => {
    const user = userEvent.setup()
    render(<App />)
    const incomeInput = screen.getByLabelText(/monthly income/i)
    await user.clear(incomeInput)
    await user.type(incomeInput, '4000')
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    // 1400/4000 = 35%
    expect(screen.getByTestId('affordability').textContent).toBe('Affordability: Borderline')
  })

  it('shows Unaffordable when ratio > 40%', async () => {
    const user = userEvent.setup()
    render(<App />)
    const incomeInput = screen.getByLabelText(/monthly income/i)
    await user.clear(incomeInput)
    await user.type(incomeInput, '3000')
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    // 1400/3000 = 46.7%
    expect(screen.getByTestId('affordability').textContent).toBe('Affordability: Unaffordable')
  })

  it('shows N/A when income is 0', async () => {
    const user = userEvent.setup()
    render(<App />)
    const incomeInput = screen.getByLabelText(/monthly income/i)
    await user.clear(incomeInput)
    await user.type(incomeInput, '0')
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    expect(screen.getByTestId('income-ratio').textContent).toContain('N/A')
    expect(screen.getByTestId('affordability').textContent).toContain('N/A')
  })

  it('calculates monthly remaining', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    // 5000 - 1645 = 3355
    expect(screen.getByTestId('monthly-remaining').textContent).toBe('Monthly Remaining: $3355')
  })

  it('reset hides results and restores defaults', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.queryByTestId('total-cost')).not.toBeInTheDocument()
    expect((screen.getByLabelText(/monthly income/i) as HTMLInputElement).value).toBe('5000')
  })

  it('recalculates on second Calculate after changing a field', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    const petFeeInput = screen.getByLabelText(/pet fee/i)
    await user.clear(petFeeInput)
    await user.type(petFeeInput, '100')
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    // 1400+150+75+100+20 = 1745
    expect(screen.getByTestId('total-cost').textContent).toBe('Total Monthly Cost: $1745')
  })
})
