import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Vocabulary List App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /vocabulary list/i })).toBeInTheDocument()
  })

  it('shows 4 seed words', () => {
    render(<App />)
    expect(screen.getAllByTestId('word-item')).toHaveLength(4)
  })

  it('shows correct initial word count', () => {
    render(<App />)
    expect(screen.getByTestId('word-count').textContent).toBe('Words: 4')
  })

  it('shows correct initial mastered count', () => {
    render(<App />)
    expect(screen.getByTestId('mastered-count').textContent).toBe('Mastered: 1')
  })

  it('shows mastered status for Luminous', () => {
    render(<App />)
    const items = screen.getAllByTestId('word-item')
    const luminous = items.find(el => within(el).getByTestId('word-term').textContent === 'Luminous')!
    expect(within(luminous).getByTestId('word-status').textContent).toBe('Mastered')
  })

  it('adds a new word', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^word$/i), 'Serendipity')
    await user.type(screen.getByLabelText(/definition/i), 'Finding something good unexpectedly.')
    await user.click(screen.getByRole('button', { name: /add word/i }))
    expect(screen.getAllByTestId('word-item')).toHaveLength(5)
    const terms = screen.getAllByTestId('word-term').map(el => el.textContent)
    expect(terms).toContain('Serendipity')
  })

  it('new word defaults to Learning', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^word$/i), 'Serendipity')
    await user.type(screen.getByLabelText(/definition/i), 'Finding something good.')
    await user.click(screen.getByRole('button', { name: /add word/i }))
    const items = screen.getAllByTestId('word-item')
    const last = items[items.length - 1]
    expect(within(last).getByTestId('word-status').textContent).toBe('Learning')
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^word$/i), 'Test')
    await user.type(screen.getByLabelText(/definition/i), 'A test word.')
    await user.click(screen.getByRole('button', { name: /add word/i }))
    expect(screen.getByLabelText(/^word$/i)).toHaveValue('')
    expect(screen.getByLabelText(/definition/i)).toHaveValue('')
  })

  it('does not add word when word field empty', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/definition/i), 'Some definition.')
    await user.click(screen.getByRole('button', { name: /add word/i }))
    expect(screen.getAllByTestId('word-item')).toHaveLength(4)
  })

  it('toggles mastery on a word', async () => {
    const user = userEvent.setup()
    render(<App />)
    const items = screen.getAllByTestId('word-item')
    const ephemeral = items.find(el => within(el).getByTestId('word-term').textContent === 'Ephemeral')!
    await user.click(within(ephemeral).getByRole('button', { name: /mark mastered/i }))
    expect(within(ephemeral).getByTestId('word-status').textContent).toBe('Mastered')
    expect(screen.getByTestId('mastered-count').textContent).toBe('Mastered: 2')
  })

  it('filter show mastered', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /show mastered/i }))
    expect(screen.getAllByTestId('word-item')).toHaveLength(1)
    expect(screen.getByTestId('word-count').textContent).toBe('Words: 4')
  })

  it('filter show unmastered', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /show unmastered/i }))
    expect(screen.getAllByTestId('word-item')).toHaveLength(3)
  })

  it('removes a word', async () => {
    const user = userEvent.setup()
    render(<App />)
    const items = screen.getAllByTestId('word-item')
    await user.click(within(items[0]).getByRole('button', { name: /remove/i }))
    expect(screen.getAllByTestId('word-item')).toHaveLength(3)
    expect(screen.getByTestId('word-count').textContent).toBe('Words: 3')
  })
})
