import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('BMI Calculator', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /bmi calculator/i })).toBeInTheDocument()
  })

  it('shows -- for bmi-value and bmi-category initially', () => {
    render(<App />)
    expect(screen.getByTestId('bmi-value').textContent).toBe('--')
    expect(screen.getByTestId('bmi-category').textContent).toBe('--')
  })

  it('calculates normal BMI in metric mode', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Weight (kg)'), '70')
    await user.type(screen.getByLabelText('Height (cm)'), '175')
    // BMI = 70 / (1.75^2) = 70 / 3.0625 ≈ 22.9
    expect(screen.getByTestId('bmi-value').textContent).toBe('22.9')
    expect(screen.getByTestId('bmi-category').textContent).toBe('Normal weight')
  })

  it('classifies Underweight', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Weight (kg)'), '45')
    await user.type(screen.getByLabelText('Height (cm)'), '175')
    expect(screen.getByTestId('bmi-category').textContent).toBe('Underweight')
  })

  it('classifies Overweight', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Weight (kg)'), '80')
    await user.type(screen.getByLabelText('Height (cm)'), '170')
    expect(screen.getByTestId('bmi-category').textContent).toBe('Overweight')
  })

  it('classifies Obese', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Weight (kg)'), '120')
    await user.type(screen.getByLabelText('Height (cm)'), '170')
    expect(screen.getByTestId('bmi-category').textContent).toBe('Obese')
  })

  it('switches to imperial mode and shows imperial inputs', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('radio', { name: /imperial/i }))
    expect(screen.getByLabelText('Weight (lbs)')).toBeInTheDocument()
    expect(screen.getByLabelText('Height (ft)')).toBeInTheDocument()
    expect(screen.getByLabelText('Height (in)')).toBeInTheDocument()
  })

  it('calculates BMI in imperial mode', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('radio', { name: /imperial/i }))
    await user.type(screen.getByLabelText('Weight (lbs)'), '154')
    await user.type(screen.getByLabelText('Height (ft)'), '5')
    await user.type(screen.getByLabelText('Height (in)'), '9')
    // BMI = 703 * 154 / (69^2) = 108262 / 4761 ≈ 22.7
    const bmi = parseFloat(screen.getByTestId('bmi-value').textContent || '0')
    expect(bmi).toBeGreaterThan(22)
    expect(bmi).toBeLessThan(24)
    expect(screen.getByTestId('bmi-category').textContent).toBe('Normal weight')
  })

  it('switching units clears inputs and resets result', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Weight (kg)'), '70')
    await user.type(screen.getByLabelText('Height (cm)'), '175')
    expect(screen.getByTestId('bmi-value').textContent).not.toBe('--')
    await user.click(screen.getByRole('radio', { name: /imperial/i }))
    expect(screen.getByTestId('bmi-value').textContent).toBe('--')
  })

  it('reset button clears everything and returns to metric', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('radio', { name: /imperial/i }))
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('bmi-value').textContent).toBe('--')
    expect(screen.getByTestId('bmi-category').textContent).toBe('--')
    expect(screen.getByLabelText('Weight (kg)')).toBeInTheDocument()
  })

  it('shows -- for zero weight', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Weight (kg)'), '0')
    await user.type(screen.getByLabelText('Height (cm)'), '170')
    expect(screen.getByTestId('bmi-value').textContent).toBe('--')
  })

  it('shows -- for zero height', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Weight (kg)'), '70')
    await user.type(screen.getByLabelText('Height (cm)'), '0')
    expect(screen.getByTestId('bmi-value').textContent).toBe('--')
  })
})
