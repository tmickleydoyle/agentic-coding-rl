import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Garden Log', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Garden Log' })).toBeTruthy()
  })

  it('shows all 4 seed entries on load', () => {
    expect(screen.getByTestId('entry-count').textContent).toContain('4')
  })

  it('shows entry count as "Showing 4 of 4 entries" on load', () => {
    expect(screen.getByTestId('entry-count').textContent).toBe('Showing 4 of 4 entries')
  })

  it('adds a new entry', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('entry-date-input'), { target: { value: '2024-02-01' } })
    await user.selectOptions(screen.getByTestId('activity-select'), 'watering')
    await user.type(screen.getByTestId('description-input'), 'Watered the roses')
    await user.click(screen.getByTestId('add-entry-btn'))
    expect(screen.getByTestId('entries-list').textContent).toContain('Watered the roses')
  })

  it('does not add entry without date', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('description-input'), 'Some activity')
    await user.click(screen.getByTestId('add-entry-btn'))
    expect(screen.getByTestId('entry-count').textContent).toContain('4 of 4')
  })

  it('does not add entry without description', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('entry-date-input'), { target: { value: '2024-02-01' } })
    await user.click(screen.getByTestId('add-entry-btn'))
    expect(screen.getByTestId('entry-count').textContent).toContain('4 of 4')
  })

  it('clears form after adding entry', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('entry-date-input'), { target: { value: '2024-02-01' } })
    await user.type(screen.getByTestId('description-input'), 'Testing clear')
    await user.type(screen.getByTestId('tags-input'), 'test')
    await user.click(screen.getByTestId('add-entry-btn'))
    expect((screen.getByTestId('entry-date-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('description-input') as HTMLTextAreaElement).value).toBe('')
    expect((screen.getByTestId('tags-input') as HTMLInputElement).value).toBe('')
  })

  it('parses tags from comma-separated input', async () => {
    const user = userEvent.setup()
    fireEvent.change(screen.getByTestId('entry-date-input'), { target: { value: '2024-02-01' } })
    await user.type(screen.getByTestId('description-input'), 'Tagged entry')
    await user.type(screen.getByTestId('tags-input'), 'rose, tulip, daisy')
    await user.click(screen.getByTestId('add-entry-btn'))
    const chips = screen.getAllByTestId('tag-chip')
    const chipTexts = chips.map(c => c.textContent)
    expect(chipTexts).toContain('rose')
    expect(chipTexts).toContain('tulip')
    expect(chipTexts).toContain('daisy')
  })

  it('filters by activity type', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-activity'), 'planting')
    expect(screen.getByTestId('entry-count').textContent).toContain('1 of 4')
  })

  it('filters by search text', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'kale')
    expect(screen.getByTestId('entry-count').textContent).toContain('1 of 4')
    expect(screen.getByTestId('entries-list').textContent).toContain('kale')
  })

  it('search is case-insensitive', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'HERB')
    expect(screen.getByTestId('entry-count').textContent).toContain('1 of 4')
  })

  it('shows no-entries-msg when filters match nothing', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'xyznotfound')
    expect(screen.getByTestId('no-entries-msg')).toBeTruthy()
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-entry-1'))
    expect(screen.getByTestId('entry-count').textContent).toContain('3 of 3')
    expect(screen.queryByTestId('entry-row-1')).toBeNull()
  })

  it('activity and search filters work together', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-activity'), 'weeding')
    await user.type(screen.getByTestId('search-input'), 'herb')
    expect(screen.getByTestId('entry-count').textContent).toContain('1 of 4')
  })
})
