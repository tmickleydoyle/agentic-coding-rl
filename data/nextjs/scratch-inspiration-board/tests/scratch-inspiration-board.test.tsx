import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Inspiration Board', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Inspiration Board' })).toBeTruthy()
  })

  it('shows initial item count as 4 items', () => {
    expect(screen.getByTestId('item-count').textContent).toBe('4 items')
  })

  it('shows initial pinned count as 2 pinned', () => {
    expect(screen.getByTestId('pinned-count').textContent).toBe('2 pinned')
  })

  it('renders all 4 seed inspiration cards', () => {
    expect(screen.getAllByTestId('inspiration-card')).toHaveLength(4)
  })

  it('shows Pinned for pinned items', () => {
    const cards = screen.getAllByTestId('inspiration-card')
    const brutalistCard = cards.find(c => within(c).getByTestId('item-title').textContent === 'Brutalist Shapes')!
    expect(within(brutalistCard).getByTestId('item-pinned').textContent).toBe('Pinned')
  })

  it('shows Unpinned for non-pinned items', () => {
    const cards = screen.getAllByTestId('inspiration-card')
    const oceanCard = cards.find(c => within(c).getByTestId('item-title').textContent === 'Ocean Textures')!
    expect(within(oceanCard).getByTestId('item-pinned').textContent).toBe('Unpinned')
  })

  it('pinned items appear before unpinned items', () => {
    const cards = screen.getAllByTestId('inspiration-card')
    const titles = cards.map(c => within(c).getByTestId('item-title').textContent)
    const firstUnpinnedIdx = titles.findIndex(t => t === 'Ocean Textures' || t === 'Street Typography')
    const lastPinnedIdx = Math.max(
      titles.findIndex(t => t === 'Brutalist Shapes'),
      titles.findIndex(t => t === '70s Color Palettes')
    )
    expect(lastPinnedIdx).toBeLessThan(firstUnpinnedIdx)
  })

  it('filters items by title text', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'ocean')
    expect(screen.getAllByTestId('inspiration-card')).toHaveLength(1)
  })

  it('filters items by category', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-category'), 'Design')
    expect(screen.getAllByTestId('inspiration-card')).toHaveLength(1)
  })

  it('filters items by pinned-only checkbox', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-pinned'))
    expect(screen.getAllByTestId('inspiration-card')).toHaveLength(2)
  })

  it('toggles pin status from pinned to unpinned', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('inspiration-card')
    const brutalistCard = cards.find(c => within(c).getByTestId('item-title').textContent === 'Brutalist Shapes')!
    expect(within(brutalistCard).getByTestId('toggle-pin').textContent).toBe('Unpin')
    await user.click(within(brutalistCard).getByTestId('toggle-pin'))
    expect(within(brutalistCard).getByTestId('item-pinned').textContent).toBe('Unpinned')
    expect(screen.getByTestId('pinned-count').textContent).toBe('1 pinned')
  })

  it('deletes an item and updates count', async () => {
    const user = userEvent.setup()
    await user.click(within(screen.getAllByTestId('inspiration-card')[0]).getByTestId('delete-item'))
    expect(screen.getAllByTestId('inspiration-card')).toHaveLength(3)
    expect(screen.getByTestId('item-count').textContent).toBe('3 items')
  })

  it('adds a valid new item', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'New Idea')
    await user.type(screen.getByTestId('input-category'), 'Concept')
    await user.type(screen.getByTestId('input-notes'), 'Some notes')
    await user.click(screen.getByTestId('submit-item'))
    expect(screen.getAllByTestId('inspiration-card')).toHaveLength(5)
    expect(screen.getByTestId('item-count').textContent).toBe('5 items')
  })

  it('shows form error when title is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-category'), 'Design')
    await user.click(screen.getByTestId('submit-item'))
    expect(screen.getByTestId('form-error').textContent).toBe('Title and category are required.')
  })

  it('item-count and pinned-count reflect totals not filtered', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-pinned'))
    expect(screen.getByTestId('item-count').textContent).toBe('4 items')
    expect(screen.getByTestId('pinned-count').textContent).toBe('2 pinned')
  })
})
