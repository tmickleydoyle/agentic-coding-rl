import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Seed Inventory', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Seed Inventory' })).toBeTruthy()
  })

  it('shows all 4 seed rows on load', () => {
    expect(screen.getByTestId('seed-row-1')).toBeTruthy()
    expect(screen.getByTestId('seed-row-2')).toBeTruthy()
    expect(screen.getByTestId('seed-row-3')).toBeTruthy()
    expect(screen.getByTestId('seed-row-4')).toBeTruthy()
  })

  it('shows correct summary on load', () => {
    expect(screen.getByTestId('summary').textContent).toContain('4 seed entries')
    expect(screen.getByTestId('summary').textContent).toContain('3 unplanted')
  })

  it('adds a new seed', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('seed-name-input'), 'Pepper')
    await user.type(screen.getByTestId('seed-variety-input'), 'Bell')
    await user.type(screen.getByTestId('seed-quantity-input'), '20')
    fireEvent.change(screen.getByTestId('seed-expiry-input'), { target: { value: '2026' } })
    await user.click(screen.getByTestId('add-seed-btn'))
    expect(screen.getByTestId('summary').textContent).toContain('5 seed entries')
  })

  it('clears form after adding seed', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('seed-name-input'), 'Pepper')
    await user.type(screen.getByTestId('seed-variety-input'), 'Bell')
    await user.type(screen.getByTestId('seed-quantity-input'), '20')
    fireEvent.change(screen.getByTestId('seed-expiry-input'), { target: { value: '2026' } })
    await user.click(screen.getByTestId('add-seed-btn'))
    expect((screen.getByTestId('seed-name-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('seed-variety-input') as HTMLInputElement).value).toBe('')
  })

  it('rejects quantity of 0', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('seed-name-input'), 'Pepper')
    await user.type(screen.getByTestId('seed-variety-input'), 'Bell')
    await user.type(screen.getByTestId('seed-quantity-input'), '0')
    fireEvent.change(screen.getByTestId('seed-expiry-input'), { target: { value: '2026' } })
    await user.click(screen.getByTestId('add-seed-btn'))
    expect(screen.getByTestId('summary').textContent).toContain('4 seed entries')
  })

  it('rejects expiry year 2019', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('seed-name-input'), 'Pepper')
    await user.type(screen.getByTestId('seed-variety-input'), 'Bell')
    await user.type(screen.getByTestId('seed-quantity-input'), '10')
    fireEvent.change(screen.getByTestId('seed-expiry-input'), { target: { value: '2019' } })
    await user.click(screen.getByTestId('add-seed-btn'))
    expect(screen.getByTestId('summary').textContent).toContain('4 seed entries')
  })

  it('marks a seed as planted', async () => {
    const user = userEvent.setup()
    const btn = screen.getByTestId('mark-planted-1')
    expect((btn as HTMLButtonElement).disabled).toBe(false)
    await user.click(btn)
    expect((screen.getByTestId('mark-planted-1') as HTMLButtonElement).disabled).toBe(true)
  })

  it('already-planted seed has disabled Mark Planted button', () => {
    // seed id 3 is planted in seed data
    expect((screen.getByTestId('mark-planted-3') as HTMLButtonElement).disabled).toBe(true)
  })

  it('deletes a seed', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-seed-1'))
    expect(screen.queryByTestId('seed-row-1')).toBeNull()
    expect(screen.getByTestId('summary').textContent).toContain('3 seed entries')
  })

  it('filters to show only unplanted', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('unplanted-filter'))
    expect(screen.queryByTestId('seed-row-3')).toBeNull()
    expect(screen.getByTestId('seed-row-1')).toBeTruthy()
  })

  it('filters expiring soon (<=2026)', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('expiring-filter'))
    // Seeds with expiryYear <= 2026: ids 1(2025), 2(2024), 3(2026), 4(2025) — all 4
    // none should be hidden since all are <= 2026
    expect(screen.getByTestId('seed-row-1')).toBeTruthy()
    expect(screen.queryByTestId('seed-row-3')).toBeTruthy()
  })

  it('both filters together: unplanted AND expiring soon', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('unplanted-filter'))
    await user.click(screen.getByTestId('expiring-filter'))
    // Planted seeds are hidden; non-expiring are hidden
    expect(screen.queryByTestId('seed-row-3')).toBeNull()
  })

  it('summary counts are not affected by filters', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('unplanted-filter'))
    expect(screen.getByTestId('summary').textContent).toContain('4 seed entries')
  })
})
