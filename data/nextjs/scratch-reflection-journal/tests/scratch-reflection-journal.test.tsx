import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Reflection Journal', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /reflection journal/i })).toBeInTheDocument()
  })

  it('shows 2 seed entries', () => {
    expect(screen.getAllByTestId('journal-entry')).toHaveLength(2)
  })

  it('shows entry count', () => {
    expect(screen.getByTestId('entry-count').textContent).toBe('Entries: 2')
  })

  it('shows mood summary', () => {
    expect(screen.getByTestId('mood-summary').textContent).toContain('Most common mood:')
  })

  it('displays entry date', () => {
    const dates = screen.getAllByTestId('entry-date')
    expect(dates[0].textContent).toBe('2024-01-15')
  })

  it('displays entry mood', () => {
    const moods = screen.getAllByTestId('entry-mood')
    expect(moods[0].textContent).toBe('happy')
  })

  it('displays entry text', () => {
    const texts = screen.getAllByTestId('entry-text')
    expect(texts[0].textContent).toContain('great day')
  })

  it('displays entry tags', () => {
    const tags = screen.getAllByTestId('entry-tags')
    expect(tags[0].textContent).toBe('work, productivity')
  })

  it('adds a new entry', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/journal text/i), 'Feeling great today!')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('journal-entry')).toHaveLength(3)
    expect(screen.getByTestId('entry-count').textContent).toBe('Entries: 3')
  })

  it('ignores add with empty text', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('journal-entry')).toHaveLength(2)
  })

  it('clears text input after add', async () => {
    const user = userEvent.setup()
    const textarea = screen.getByLabelText(/journal text/i)
    await user.type(textarea, 'New reflection')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect((textarea as HTMLTextAreaElement).value).toBe('')
  })

  it('parses tags on add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/journal text/i), 'Tagged entry')
    await user.type(screen.getByLabelText(/tags/i), 'focus, mindset')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    const tagEls = screen.getAllByTestId('entry-tags')
    expect(tagEls[2].textContent).toBe('focus, mindset')
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('journal-entry')).toHaveLength(1)
    expect(screen.getByTestId('entry-count').textContent).toBe('Entries: 1')
  })

  it('search filters entries', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search entries/i), 'great')
    expect(screen.getAllByTestId('journal-entry')).toHaveLength(1)
    expect(screen.getByTestId('entry-count').textContent).toBe('Entries: 1')
  })

  it('search is case-insensitive', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search entries/i), 'GREAT')
    expect(screen.getAllByTestId('journal-entry')).toHaveLength(1)
  })

  it('clearing search shows all entries', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByLabelText(/search entries/i)
    await user.type(searchInput, 'great')
    await user.clear(searchInput)
    expect(screen.getAllByTestId('journal-entry')).toHaveLength(2)
  })
})
