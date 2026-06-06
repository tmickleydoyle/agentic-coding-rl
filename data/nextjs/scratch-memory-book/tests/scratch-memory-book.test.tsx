import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Memory Book', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /memory book/i })).toBeTruthy()
  })

  it('renders 3 seed memories on load', () => {
    expect(screen.getAllByTestId('memory-card')).toHaveLength(3)
  })

  it('shows memory count of 3 on load', () => {
    expect(screen.getByTestId('memory-count').textContent).toContain('3')
  })

  it('renders seed memory titles', () => {
    expect(screen.getByText('First Day of School')).toBeTruthy()
    expect(screen.getByText('Family Reunion')).toBeTruthy()
    expect(screen.getByText('Rainy Sunday')).toBeTruthy()
  })

  it('renders mood badges for seed memories', () => {
    const badges = screen.getAllByTestId('mood-badge')
    expect(badges).toHaveLength(3)
  })

  it('renders tags for seed memories', () => {
    const tags = screen.getAllByTestId('tag')
    expect(tags.length).toBeGreaterThan(0)
  })

  it('adds a new memory with valid data', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Summer BBQ')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-07-20' } })
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('memory-card')).toHaveLength(4)
    expect(screen.getByText('Summer BBQ')).toBeTruthy()
  })

  it('shows validation error when title is missing', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-07-20' } })
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error').textContent).toContain('Title and date are required')
  })

  it('shows validation error when date is missing', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'No Date Memory')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error')).toBeTruthy()
  })

  it('parses comma-separated tags on add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Tagged Memory')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-08-01' } })
    await user.type(screen.getByTestId('input-tags'), 'travel, adventure, fun')
    await user.click(screen.getByTestId('add-btn'))
    const tags = screen.getAllByTestId('tag')
    const tagTexts = tags.map(t => t.textContent)
    expect(tagTexts).toContain('travel')
    expect(tagTexts).toContain('adventure')
    expect(tagTexts).toContain('fun')
  })

  it('filters memories by mood', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('mood-filter'), { target: { value: 'happy' } })
    const cards = screen.getAllByTestId('memory-card')
    expect(cards).toHaveLength(1)
    expect(screen.getByTestId('memory-count').textContent).toContain('1')
  })

  it('shows all memories when filter is set to All Moods', async () => {
    fireEvent.change(screen.getByTestId('mood-filter'), { target: { value: 'happy' } })
    fireEvent.change(screen.getByTestId('mood-filter'), { target: { value: '' } })
    expect(screen.getAllByTestId('memory-card')).toHaveLength(3)
  })

  it('shows empty state when filter has no matches', async () => {
    fireEvent.change(screen.getByTestId('mood-filter'), { target: { value: 'sad' } })
    expect(screen.getByTestId('empty-state')).toBeTruthy()
  })

  it('deletes a memory', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('delete-btn')[0])
    expect(screen.getAllByTestId('memory-card')).toHaveLength(2)
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Clear Test')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-09-01' } })
    await user.click(screen.getByTestId('add-btn'))
    expect((screen.getByTestId('input-title') as HTMLInputElement).value).toBe('')
  })
})
