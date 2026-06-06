import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

// All date calculations use TODAY = "2024-12-01" (hardcoded in App)

describe('Anniversary Log', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /anniversary log/i })).toBeTruthy()
  })

  it('renders 4 seed anniversaries on load', () => {
    expect(screen.getAllByTestId('anniversary-card')).toHaveLength(4)
  })

  it('shows anniversary count of 4 on load', () => {
    expect(screen.getByTestId('anniversary-count').textContent).toContain('4')
  })

  it('renders category badges for all anniversaries', () => {
    expect(screen.getAllByTestId('category-badge')).toHaveLength(4)
  })

  it('renders years-elapsed for wedding anniversary (2018 -> 2024 = 6 years, but sept 14 passed by dec 1)', () => {
    const elapsed = screen.getAllByTestId('years-elapsed')
    // Wedding anniversary 2018-09-14, today 2024-12-01 → 6 full years
    expect(elapsed[0].textContent).toContain('6')
  })

  it('renders days-until for each anniversary', () => {
    const daysUntil = screen.getAllByTestId('days-until')
    expect(daysUntil).toHaveLength(4)
  })

  it('wedding anniversary next is 2025-09-14; days from 2024-12-01', () => {
    // 2025-09-14 minus 2024-12-01 = 286 days
    const daysUntil = screen.getAllByTestId('days-until')
    expect(daysUntil[0].textContent).toContain('286')
  })

  it('adds a new anniversary with valid data', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Graduation Day')
    fireEvent.change(screen.getByTestId('input-original-date'), { target: { value: '2015-05-20' } })
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('anniversary-card')).toHaveLength(5)
    expect(screen.getByText('Graduation Day')).toBeTruthy()
  })

  it('shows validation error when title is missing', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('input-original-date'), { target: { value: '2020-01-01' } })
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error').textContent).toContain('Title and date are required')
  })

  it('shows validation error when date is missing', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'No Date')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error')).toBeTruthy()
  })

  it('does not add anniversary on validation failure', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('anniversary-card')).toHaveLength(4)
  })

  it('clears form after successful add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Test Event')
    fireEvent.change(screen.getByTestId('input-original-date'), { target: { value: '2010-03-15' } })
    await user.click(screen.getByTestId('add-btn'))
    expect((screen.getByTestId('input-title') as HTMLInputElement).value).toBe('')
  })

  it('filters anniversaries by category', () => {
    fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'personal' } })
    expect(screen.getAllByTestId('anniversary-card')).toHaveLength(2)
    expect(screen.getByTestId('anniversary-count').textContent).toContain('2')
  })

  it('shows all when filter reset to All Categories', () => {
    fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'career' } })
    fireEvent.change(screen.getByTestId('category-filter'), { target: { value: '' } })
    expect(screen.getAllByTestId('anniversary-card')).toHaveLength(4)
  })

  it('shows empty state when filter has no matches', () => {
    fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'health' } })
    expect(screen.getByTestId('empty-state')).toBeTruthy()
  })

  it('deletes an anniversary', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('delete-btn')[0])
    expect(screen.getAllByTestId('anniversary-card')).toHaveLength(3)
  })
})
