import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Exchange Rate Table', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /exchange rate table/i })).toBeTruthy()
  })

  it('renders all 5 seed rows', () => {
    expect(screen.getByTestId('row-1')).toBeTruthy()
    expect(screen.getByTestId('row-2')).toBeTruthy()
    expect(screen.getByTestId('row-3')).toBeTruthy()
    expect(screen.getByTestId('row-4')).toBeTruthy()
    expect(screen.getByTestId('row-5')).toBeTruthy()
  })

  it('shows count summary', () => {
    expect(screen.getByTestId('rate-count').textContent).toContain('5')
  })

  it('displays rate with 4 decimal places', () => {
    expect(screen.getByTestId('rate-cell-1').textContent).toContain('0.9200')
  })

  it('adds a new rate', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('from-input'), 'CAD')
    await user.type(screen.getByTestId('to-input'), 'USD')
    await user.type(screen.getByTestId('rate-input'), '0.74')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('row-6')).toBeTruthy()
    expect(screen.getByTestId('rate-count').textContent).toContain('6')
  })

  it('clears inputs after add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('from-input'), 'CAD')
    await user.type(screen.getByTestId('to-input'), 'USD')
    await user.type(screen.getByTestId('rate-input'), '0.74')
    await user.click(screen.getByTestId('add-btn'))
    const fromInput = screen.getByTestId('from-input') as HTMLInputElement
    expect(fromInput.value).toBe('')
  })

  it('does not add duplicate pair', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('from-input'), 'USD')
    await user.type(screen.getByTestId('to-input'), 'EUR')
    await user.type(screen.getByTestId('rate-input'), '0.9')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('rate-count').textContent).toContain('5')
  })

  it('does not add with empty from field', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('to-input'), 'USD')
    await user.type(screen.getByTestId('rate-input'), '1.5')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('rate-count').textContent).toContain('5')
  })

  it('deletes a row', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-3'))
    expect(screen.queryByTestId('row-3')).toBeNull()
    expect(screen.getByTestId('rate-count').textContent).toContain('4')
  })

  it('enters edit mode on edit click', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('edit-btn-1'))
    expect(screen.getByTestId('rate-edit-1')).toBeTruthy()
    expect(screen.getByTestId('save-btn-1')).toBeTruthy()
    expect(screen.getByTestId('cancel-btn-1')).toBeTruthy()
  })

  it('saves edited rate', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('edit-btn-2'))
    await user.clear(screen.getByTestId('rate-edit-2'))
    await user.type(screen.getByTestId('rate-edit-2'), '0.85')
    await user.click(screen.getByTestId('save-btn-2'))
    expect(screen.getByTestId('rate-cell-2').textContent).toContain('0.8500')
  })

  it('cancels edit without saving', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('edit-btn-1'))
    await user.clear(screen.getByTestId('rate-edit-1'))
    await user.type(screen.getByTestId('rate-edit-1'), '9.9999')
    await user.click(screen.getByTestId('cancel-btn-1'))
    expect(screen.getByTestId('rate-cell-1').textContent).toContain('0.9200')
  })

  it('enforces uppercase on from input', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('from-input'), 'aud')
    const input = screen.getByTestId('from-input') as HTMLInputElement
    expect(input.value).toBe('AUD')
  })
})
