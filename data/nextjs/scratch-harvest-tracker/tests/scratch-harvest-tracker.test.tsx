import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Harvest Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Harvest Tracker' })).toBeTruthy()
  })

  it('shows all 5 harvest rows on load', () => {
    expect(screen.getByTestId('harvest-row-1')).toBeTruthy()
    expect(screen.getByTestId('harvest-row-5')).toBeTruthy()
  })

  it('shows correct overall total on load', () => {
    // 2.3 + 1.1 + 1.8 + 0.2 + 0.9 = 6.3
    expect(screen.getByTestId('overall-total').textContent).toContain('6.3')
  })

  it('shows per-crop totals', () => {
    // Tomatoes: 2.3 + 1.8 = 4.1
    expect(screen.getByTestId('crop-total-Tomatoes').textContent).toContain('4.1')
    // Zucchini: 1.1 + 0.9 = 2.0
    expect(screen.getByTestId('crop-total-Zucchini').textContent).toContain('2')
    // Basil: 0.2
    expect(screen.getByTestId('crop-total-Basil').textContent).toContain('0.2')
  })

  it('logs a new harvest', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('crop-input'), 'Cucumbers')
    fireEvent.change(screen.getByTestId('harvest-date-input'), { target: { value: '2024-08-20' } })
    fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '0.5' } })
    await user.click(screen.getByTestId('log-harvest-btn'))
    expect(screen.getByTestId('harvest-list').textContent).toContain('Cucumbers')
  })

  it('clears form after logging harvest', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('crop-input'), 'Cucumbers')
    fireEvent.change(screen.getByTestId('harvest-date-input'), { target: { value: '2024-08-20' } })
    fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '0.5' } })
    await user.click(screen.getByTestId('log-harvest-btn'))
    expect((screen.getByTestId('crop-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('harvest-date-input') as HTMLInputElement).value).toBe('')
  })

  it('rejects weight of 0', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('crop-input'), 'Cucumbers')
    fireEvent.change(screen.getByTestId('harvest-date-input'), { target: { value: '2024-08-20' } })
    fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '0' } })
    await user.click(screen.getByTestId('log-harvest-btn'))
    expect(screen.queryByTestId('harvest-row-6')).toBeNull()
  })

  it('new crop appears in crop filter', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('crop-input'), 'Cucumbers')
    fireEvent.change(screen.getByTestId('harvest-date-input'), { target: { value: '2024-08-20' } })
    fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '0.5' } })
    await user.click(screen.getByTestId('log-harvest-btn'))
    const filter = screen.getByTestId('crop-filter') as HTMLSelectElement
    const options = Array.from(filter.options).map(o => o.value)
    expect(options).toContain('Cucumbers')
  })

  it('filters harvest list by crop', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('crop-filter'), 'Tomatoes')
    expect(screen.getByTestId('harvest-row-1')).toBeTruthy()
    expect(screen.queryByTestId('harvest-row-2')).toBeNull()
  })

  it('totals panel is not affected by crop filter', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('crop-filter'), 'Tomatoes')
    expect(screen.getByTestId('crop-total-Zucchini')).toBeTruthy()
    expect(screen.getByTestId('overall-total').textContent).toContain('6.3')
  })

  it('deletes a harvest', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-harvest-4'))
    expect(screen.queryByTestId('harvest-row-4')).toBeNull()
  })

  it('updates overall total after deleting', async () => {
    const user = userEvent.setup()
    // Delete Basil (0.2 kg), total should become 6.1
    await user.click(screen.getByTestId('delete-harvest-4'))
    expect(screen.getByTestId('overall-total').textContent).toContain('6.1')
  })

  it('shows no-harvests-msg when all deleted', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-harvest-1'))
    await user.click(screen.getByTestId('delete-harvest-2'))
    await user.click(screen.getByTestId('delete-harvest-3'))
    await user.click(screen.getByTestId('delete-harvest-4'))
    await user.click(screen.getByTestId('delete-harvest-5'))
    expect(screen.getByTestId('no-harvests-msg')).toBeTruthy()
  })

  it('trims crop name on submit', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('crop-input'), '  Pepper  ')
    fireEvent.change(screen.getByTestId('harvest-date-input'), { target: { value: '2024-08-20' } })
    fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '1.0' } })
    await user.click(screen.getByTestId('log-harvest-btn'))
    const filter = screen.getByTestId('crop-filter') as HTMLSelectElement
    const options = Array.from(filter.options).map(o => o.value)
    expect(options).toContain('Pepper')
    expect(options).not.toContain('  Pepper  ')
  })
})
