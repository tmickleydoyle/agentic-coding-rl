import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Weather Notes', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Weather Notes' })).toBeTruthy()
  })

  it('shows all 4 observations on load', () => {
    expect(screen.getByTestId('obs-row-1')).toBeTruthy()
    expect(screen.getByTestId('obs-row-4')).toBeTruthy()
  })

  it('shows stats panel on load', () => {
    expect(screen.getByTestId('stats-panel')).toBeTruthy()
  })

  it('shows correct average temperature', () => {
    // (12 + 8 + 5 + 15) / 4 = 10.0
    expect(screen.getByTestId('avg-temp').textContent).toContain('10')
  })

  it('shows correct average humidity', () => {
    // (45 + 70 + 90 + 40) / 4 = 61.25 -> 61.3
    expect(screen.getByTestId('avg-humidity').textContent).toContain('61.3')
  })

  it('shows most common condition', () => {
    // sunny appears 2 times, others 1
    expect(screen.getByTestId('common-condition').textContent).toContain('sunny')
  })

  it('adds a new observation', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('obs-date-input'), { target: { value: '2024-01-16' } })
    fireEvent.change(screen.getByTestId('obs-temp-input'), { target: { value: '10' } })
    fireEvent.change(screen.getByTestId('obs-humidity-input'), { target: { value: '60' } })
    await user.click(screen.getByTestId('add-obs-btn'))
    expect(screen.getByTestId('obs-list').textContent).toContain('2024-01-16')
  })

  it('clears form after adding observation', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('obs-date-input'), { target: { value: '2024-01-16' } })
    fireEvent.change(screen.getByTestId('obs-temp-input'), { target: { value: '10' } })
    fireEvent.change(screen.getByTestId('obs-humidity-input'), { target: { value: '60' } })
    await user.click(screen.getByTestId('add-obs-btn'))
    expect((screen.getByTestId('obs-date-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('obs-temp-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('obs-condition-select') as HTMLSelectElement).value).toBe('sunny')
  })

  it('rejects humidity > 100', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('obs-date-input'), { target: { value: '2024-01-16' } })
    fireEvent.change(screen.getByTestId('obs-temp-input'), { target: { value: '10' } })
    fireEvent.change(screen.getByTestId('obs-humidity-input'), { target: { value: '150' } })
    await user.click(screen.getByTestId('add-obs-btn'))
    expect(screen.queryByTestId('obs-row-5')).toBeNull()
  })

  it('accepts negative temperature', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('obs-date-input'), { target: { value: '2024-01-17' } })
    fireEvent.change(screen.getByTestId('obs-temp-input'), { target: { value: '-5' } })
    fireEvent.change(screen.getByTestId('obs-humidity-input'), { target: { value: '80' } })
    await user.click(screen.getByTestId('add-obs-btn'))
    expect(screen.getByTestId('obs-list').textContent).toContain('-5')
  })

  it('filters by condition', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('condition-filter'), 'rainy')
    expect(screen.getByTestId('obs-row-3')).toBeTruthy()
    expect(screen.queryByTestId('obs-row-1')).toBeNull()
  })

  it('stats are not affected by condition filter', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('condition-filter'), 'sunny')
    expect(screen.getByTestId('avg-temp').textContent).toContain('10')
  })

  it('deletes an observation', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-obs-1'))
    expect(screen.queryByTestId('obs-row-1')).toBeNull()
  })

  it('shows no-obs-msg when all deleted and hides stats', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-obs-1'))
    await user.click(screen.getByTestId('delete-obs-2'))
    await user.click(screen.getByTestId('delete-obs-3'))
    await user.click(screen.getByTestId('delete-obs-4'))
    expect(screen.getByTestId('no-obs-msg')).toBeTruthy()
    expect(screen.queryByTestId('stats-panel')).toBeNull()
  })

  it('accepts humidity of 0', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('obs-date-input'), { target: { value: '2024-01-18' } })
    fireEvent.change(screen.getByTestId('obs-temp-input'), { target: { value: '20' } })
    fireEvent.change(screen.getByTestId('obs-humidity-input'), { target: { value: '0' } })
    await user.click(screen.getByTestId('add-obs-btn'))
    expect(screen.getByTestId('obs-list').textContent).toContain('2024-01-18')
  })
})
