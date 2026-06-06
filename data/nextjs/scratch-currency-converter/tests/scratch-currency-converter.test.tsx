import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Currency Converter', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /currency converter/i })).toBeTruthy()
  })

  it('renders amount input', () => {
    expect(screen.getByTestId('amount-input')).toBeTruthy()
  })

  it('renders from and to selects with default values', () => {
    const fromSelect = screen.getByTestId('from-select') as HTMLSelectElement
    const toSelect = screen.getByTestId('to-select') as HTMLSelectElement
    expect(fromSelect.value).toBe('USD')
    expect(toSelect.value).toBe('EUR')
  })

  it('shows seed history entries', () => {
    expect(screen.getByTestId('history-entry-0')).toBeTruthy()
    expect(screen.getByTestId('history-entry-1')).toBeTruthy()
  })

  it('seed history entry 0 contains USD to EUR', () => {
    const entry = screen.getByTestId('history-entry-0')
    expect(entry.textContent).toContain('USD')
    expect(entry.textContent).toContain('EUR')
  })

  it('converts USD to EUR correctly', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '100')
    await user.click(screen.getByTestId('convert-btn'))
    const result = screen.getByTestId('result-display')
    expect(result.textContent).toContain('100.00 USD = 92.00 EUR')
  })

  it('adds new entry to history on convert', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '50')
    await user.click(screen.getByTestId('convert-btn'))
    // new entry becomes index 0 (newest first)
    expect(screen.getByTestId('history-entry-0')).toBeTruthy()
    expect(screen.getByTestId('history-entry-2')).toBeTruthy()
  })

  it('does nothing when amount is 0', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.click(screen.getByTestId('convert-btn'))
    // still only 2 seed entries
    expect(screen.queryByTestId('history-entry-2')).toBeNull()
  })

  it('clears history', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('clear-history-btn'))
    expect(screen.queryByTestId('history-entry-0')).toBeNull()
    const list = screen.getByTestId('history-list')
    expect(list.children.length).toBe(0)
  })

  it('can change to currency and convert', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('to-select'), 'JPY')
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '1')
    await user.click(screen.getByTestId('convert-btn'))
    const result = screen.getByTestId('result-display')
    expect(result.textContent).toContain('JPY')
  })

  it('converts same currency (USD to USD)', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('to-select'), 'USD')
    await user.clear(screen.getByTestId('amount-input'))
    await user.type(screen.getByTestId('amount-input'), '50')
    await user.click(screen.getByTestId('convert-btn'))
    expect(screen.getByTestId('result-display').textContent).toContain('50.00 USD = 50.00 USD')
  })

  it('renders convert button', () => {
    expect(screen.getByTestId('convert-btn')).toBeTruthy()
  })

  it('renders clear history button', () => {
    expect(screen.getByTestId('clear-history-btn')).toBeTruthy()
  })
})
