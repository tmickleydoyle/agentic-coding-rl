import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Timeline Journal', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /timeline journal/i })).toBeTruthy()
  })

  it('renders 4 seed entries on load', () => {
    expect(screen.getAllByTestId('entry-card')).toHaveLength(4)
  })

  it('shows entry count of 4 on load', () => {
    expect(screen.getByTestId('entry-count').textContent).toContain('4')
  })

  it('renders seed entry titles', () => {
    expect(screen.getByText('Started new job')).toBeTruthy()
    expect(screen.getByText('Adopted a dog')).toBeTruthy()
    expect(screen.getByText('Completed marathon')).toBeTruthy()
    expect(screen.getByText('Moved to new apartment')).toBeTruthy()
  })

  it('displays entries sorted newest first', () => {
    const dates = screen.getAllByTestId('entry-date').map(el => el.textContent)
    for (let i = 0; i < dates.length - 1; i++) {
      expect((dates[i] as string) >= (dates[i + 1] as string)).toBe(true)
    }
  })

  it('renders category badges', () => {
    const badges = screen.getAllByTestId('category-badge')
    expect(badges).toHaveLength(4)
  })

  it('adds a new entry with valid data', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Learned to cook')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-10-15' } })
    await user.type(screen.getByTestId('input-content'), 'Made pasta from scratch')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('entry-card')).toHaveLength(5)
    expect(screen.getByText('Learned to cook')).toBeTruthy()
  })

  it('newly added entry appears in correct sorted position', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Very Recent Event')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2025-01-01' } })
    await user.type(screen.getByTestId('input-content'), 'New year new me')
    await user.click(screen.getByTestId('add-btn'))
    const dates = screen.getAllByTestId('entry-date').map(el => el.textContent)
    expect(dates[0]).toBe('2025-01-01')
  })

  it('shows validation error when title is missing', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-10-15' } })
    await user.type(screen.getByTestId('input-content'), 'Some content')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error').textContent).toContain('Title, date, and content are required')
  })

  it('shows validation error when content is missing', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'No content')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-10-15' } })
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error')).toBeTruthy()
  })

  it('filters entries by category', () => {
    fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'personal' } })
    const cards = screen.getAllByTestId('entry-card')
    expect(cards).toHaveLength(2)
  })

  it('shows empty state when filter has no matches', () => {
    fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'travel' } })
    expect(screen.getByTestId('empty-state')).toBeTruthy()
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('delete-btn')[0])
    expect(screen.getAllByTestId('entry-card')).toHaveLength(3)
  })

  it('updates entry count after deletion', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('delete-btn')[0])
    expect(screen.getByTestId('entry-count').textContent).toContain('3')
  })

  it('shows empty state when all entries are deleted', async () => {
    const user = userEvent.setup()
    for (let i = 0; i < 4; i++) {
      await user.click(screen.getAllByTestId('delete-btn')[0])
    }
    expect(screen.getByTestId('empty-state')).toBeTruthy()
  })
})
