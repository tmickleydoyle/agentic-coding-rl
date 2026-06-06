import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Savings Jar', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /savings jar/i })).toBeTruthy()
  })

  it('renders seed jars', () => {
    expect(screen.getByTestId('jar-1')).toBeTruthy()
    expect(screen.getByTestId('jar-2')).toBeTruthy()
    expect(screen.getByTestId('jar-3')).toBeTruthy()
  })

  it('shows jar names', () => {
    expect(screen.getByTestId('jar-name-1').textContent).toContain('Vacation Fund')
    expect(screen.getByTestId('jar-name-2').textContent).toContain('New Laptop')
    expect(screen.getByTestId('jar-name-3').textContent).toContain('Emergency')
  })

  it('shows balance and target for seed jar', () => {
    const balance1 = screen.getByTestId('jar-balance-1')
    expect(balance1.textContent).toContain('320.00')
    expect(balance1.textContent).toContain('1500.00')
  })

  it('shows Complete status when balance equals target', () => {
    expect(screen.getByTestId('jar-status-3').textContent).toContain('Complete')
  })

  it('shows In Progress status when balance is below target', () => {
    expect(screen.getByTestId('jar-status-1').textContent).toContain('In Progress')
  })

  it('shows percent complete', () => {
    // jar-2: 150/800 = 18.75% -> floor = 18
    expect(screen.getByTestId('jar-pct-2').textContent).toContain('18%')
  })

  it('adds a new jar', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('jar-name-input'), 'Car Fund')
    await user.type(screen.getByTestId('jar-target-input'), '5000')
    await user.click(screen.getByTestId('add-jar-btn'))
    expect(screen.getByTestId('jar-4')).toBeTruthy()
    expect(screen.getByTestId('jar-name-4').textContent).toContain('Car Fund')
  })

  it('does not add jar with empty name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('jar-target-input'), '1000')
    await user.click(screen.getByTestId('add-jar-btn'))
    expect(screen.queryByTestId('jar-4')).toBeNull()
  })

  it('does not add jar with zero target', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('jar-name-input'), 'Test')
    await user.type(screen.getByTestId('jar-target-input'), '0')
    await user.click(screen.getByTestId('add-jar-btn'))
    expect(screen.queryByTestId('jar-4')).toBeNull()
  })

  it('deposits amount into jar', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('deposit-input-1'), '100')
    await user.click(screen.getByTestId('deposit-btn-1'))
    const balance = screen.getByTestId('jar-balance-1')
    expect(balance.textContent).toContain('420.00')
  })

  it('caps deposit at target', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('deposit-input-1'), '9999')
    await user.click(screen.getByTestId('deposit-btn-1'))
    expect(screen.getByTestId('jar-balance-1').textContent).toContain('1500.00')
    expect(screen.getByTestId('jar-status-1').textContent).toContain('Complete')
  })

  it('withdraws amount from jar', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('withdraw-input-2'), '50')
    await user.click(screen.getByTestId('withdraw-btn-2'))
    expect(screen.getByTestId('jar-balance-2').textContent).toContain('100.00')
  })

  it('floors withdrawal at zero', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('withdraw-input-2'), '9999')
    await user.click(screen.getByTestId('withdraw-btn-2'))
    expect(screen.getByTestId('jar-balance-2').textContent).toContain('0.00')
  })

  it('deletes a jar', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-2'))
    expect(screen.queryByTestId('jar-2')).toBeNull()
    expect(screen.getByTestId('jar-1')).toBeTruthy()
  })

  it('progress bar has correct width style for complete jar', () => {
    const container = screen.getByTestId('progress-bar-3')
    const fill = container.querySelector('div') as HTMLElement
    expect(fill.style.width).toBe('100%')
  })
})
