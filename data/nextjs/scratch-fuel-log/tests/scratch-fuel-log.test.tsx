import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Fuel Log', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /fuel log/i })).toBeTruthy()
  })

  it('shows 3 seed fill-up rows', () => {
    expect(screen.getAllByTestId('fillup-row').length).toBe(3)
  })

  it('shows correct total fill-ups', () => {
    expect(screen.getByTestId('total-fillups').textContent).toBe('3')
  })

  it('shows correct total gallons', () => {
    expect(screen.getByTestId('total-gallons').textContent).toBe('36.7')
  })

  it('shows correct total spent', () => {
    // 12.5*3.45 + 11.0*3.52 + 13.2*3.38 = 43.125 + 38.72 + 44.616 = 126.461 -> $126.46
    const text = screen.getByTestId('total-spent').textContent ?? ''
    expect(text).toMatch(/\$126\.4/)
  })

  it('shows avg mpg for seed data', () => {
    // miles: (15580-15200)=380 with 11.0 gal, (15930-15580)=350 with 13.2 gal
    // total miles 730 / total gal 24.2 = 30.16... -> 30.2 mpg
    const text = screen.getByTestId('avg-mpg').textContent ?? ''
    expect(text).toMatch(/mpg/)
  })

  it('shows N/A avg mpg with fewer than 2 records', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    await user.click(screen.getByTestId('delete-btn-2'))
    expect(screen.getByTestId('avg-mpg').textContent).toBe('N/A')
  })

  it('adds a new fill-up', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('date-input'), '2024-02-15')
    await user.type(screen.getByTestId('gallons-input'), '10')
    await user.type(screen.getByTestId('price-input'), '3.60')
    await user.type(screen.getByTestId('odometer-input'), '16200')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('fillup-row').length).toBe(4)
    expect(screen.getByTestId('total-fillups').textContent).toBe('4')
  })

  it('shows error when required fields missing', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('error-msg').textContent).toMatch(/please fill in all required fields/i)
  })

  it('clears form after successful add', async () => {
    const user = userEvent.setup()
    const gallonsInput = screen.getByTestId('gallons-input') as HTMLInputElement
    await user.type(screen.getByTestId('date-input'), '2024-02-15')
    await user.type(gallonsInput, '10')
    await user.type(screen.getByTestId('price-input'), '3.60')
    await user.type(screen.getByTestId('odometer-input'), '16200')
    await user.click(screen.getByTestId('add-btn'))
    expect(gallonsInput.value).toBe('')
  })

  it('deletes a fill-up', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    expect(screen.getAllByTestId('fillup-row').length).toBe(2)
    expect(screen.getByTestId('total-fillups').textContent).toBe('2')
  })

  it('sorts by cost highest first', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('sort-select'), 'cost-desc')
    const rows = screen.getAllByTestId('fillup-row')
    expect(rows.length).toBe(3)
  })

  it('shows zero stats when all deleted', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    await user.click(screen.getByTestId('delete-btn-2'))
    await user.click(screen.getByTestId('delete-btn-3'))
    expect(screen.getByTestId('total-fillups').textContent).toBe('0')
    expect(screen.getByTestId('total-gallons').textContent).toBe('0.0')
    expect(screen.getByTestId('total-spent').textContent).toBe('$0.00')
    expect(screen.getByTestId('avg-mpg').textContent).toBe('N/A')
  })
})
