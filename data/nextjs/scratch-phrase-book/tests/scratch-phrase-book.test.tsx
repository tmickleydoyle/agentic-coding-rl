import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Phrase Book', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: 'Phrase Book' })).toBeTruthy()
  })

  it('shows 6 phrases initially', () => {
    expect(screen.getByTestId('phrase-count').textContent).toBe('6 phrases')
  })

  it('renders all seed phrases', () => {
    expect(screen.getByTestId('phrase-1')).toBeTruthy()
    expect(screen.getByTestId('phrase-6')).toBeTruthy()
  })

  it('shows english text', () => {
    expect(screen.getByTestId('english-1').textContent).toBe('Where is the bathroom?')
  })

  it('shows translation text', () => {
    expect(screen.getByTestId('translation-4').textContent).toContain('table pour deux')
  })

  it('shows category', () => {
    expect(screen.getByTestId('category-2').textContent).toBe('Shopping')
  })

  it('favorite btn shows Favorite initially', () => {
    expect(screen.getByTestId('favorite-btn-1').textContent).toBe('Favorite')
  })

  it('clicking Favorite changes button to Unfavorite', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('favorite-btn-1'))
    expect(screen.getByTestId('favorite-btn-1').textContent).toBe('Unfavorite')
  })

  it('clicking Unfavorite reverts to Favorite', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('favorite-btn-1'))
    await user.click(screen.getByTestId('favorite-btn-1'))
    expect(screen.getByTestId('favorite-btn-1').textContent).toBe('Favorite')
  })

  it('favorites toggle button shows Show Favorites initially', () => {
    expect(screen.getByTestId('favorites-toggle').textContent).toBe('Show Favorites')
  })

  it('favorites only mode shows empty when none favorited', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('favorites-toggle'))
    expect(screen.getByTestId('phrase-count').textContent).toBe('0 phrases')
  })

  it('favorites toggle text changes to Show All in favorites mode', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('favorites-toggle'))
    expect(screen.getByTestId('favorites-toggle').textContent).toBe('Show All')
  })

  it('shows favorited phrase in favorites mode', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('favorite-btn-3'))
    await user.click(screen.getByTestId('favorites-toggle'))
    expect(screen.getByTestId('phrase-3')).toBeTruthy()
    expect(screen.queryByTestId('phrase-1')).toBeNull()
    expect(screen.getByTestId('phrase-count').textContent).toBe('1 phrases')
  })

  it('category filter shows only Essentials', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('category-filter'), 'Essentials')
    expect(screen.getByTestId('phrase-1')).toBeTruthy()
    expect(screen.getByTestId('phrase-3')).toBeTruthy()
    expect(screen.queryByTestId('phrase-2')).toBeNull()
    expect(screen.getByTestId('phrase-count').textContent).toBe('2 phrases')
  })

  it('combined filter: category + favorites', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('favorite-btn-1'))
    await user.click(screen.getByTestId('favorite-btn-2'))
    await user.selectOptions(screen.getByTestId('category-filter'), 'Shopping')
    await user.click(screen.getByTestId('favorites-toggle'))
    expect(screen.getByTestId('phrase-2')).toBeTruthy()
    expect(screen.queryByTestId('phrase-1')).toBeNull()
    expect(screen.getByTestId('phrase-count').textContent).toBe('1 phrases')
  })
})
