import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Translation Pad', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: 'Translation Pad' })).toBeTruthy()
  })

  it('shows 4 seed entries initially', () => {
    expect(screen.getByTestId('translation-1')).toBeTruthy()
    expect(screen.getByTestId('translation-4')).toBeTruthy()
  })

  it('total-count shows 4 translations', () => {
    expect(screen.getByTestId('total-count').textContent).toBe('4 translations')
  })

  it('shows source text for entry 1', () => {
    expect(screen.getByTestId('source-1').textContent).toBe('Good morning')
  })

  it('shows target text for entry 2', () => {
    expect(screen.getByTestId('target-2').textContent).toBe('Comment allez-vous?')
  })

  it('shows pair for entry 3', () => {
    expect(screen.getByTestId('pair-3').textContent).toBe('EN→IT')
  })

  it('no error-msg initially', () => {
    expect(screen.queryByTestId('error-msg')).toBeNull()
  })

  it('search filters by source text', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'morning')
    expect(screen.getByTestId('translation-1')).toBeTruthy()
    expect(screen.queryByTestId('translation-2')).toBeNull()
  })

  it('search filters by target text', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'gracias')
    expect(screen.getByTestId('translation-4')).toBeTruthy()
    expect(screen.queryByTestId('translation-1')).toBeNull()
  })

  it('search is case-insensitive', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'BUENOS')
    expect(screen.getByTestId('translation-1')).toBeTruthy()
  })

  it('total-count updates during search', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'good')
    expect(screen.getByTestId('total-count').textContent).toBe('2 translations')
  })

  it('clearing search restores all entries', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'morning')
    await user.clear(screen.getByTestId('search-input'))
    expect(screen.getByTestId('total-count').textContent).toBe('4 translations')
  })

  it('saves a new translation', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('source-input'), 'Please')
    await user.type(screen.getByTestId('target-input'), 'Por favor')
    await user.click(screen.getByTestId('save-btn'))
    expect(screen.getByTestId('total-count').textContent).toBe('5 translations')
  })

  it('clears source and target after save', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('source-input'), 'Yes')
    await user.type(screen.getByTestId('target-input'), 'Sí')
    await user.click(screen.getByTestId('save-btn'))
    expect((screen.getByTestId('source-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('target-input') as HTMLInputElement).value).toBe('')
  })

  it('shows error when source is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('target-input'), 'Sí')
    await user.click(screen.getByTestId('save-btn'))
    expect(screen.getByTestId('error-msg').textContent).toBe('Source and translation are required.')
  })

  it('shows error when target is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('source-input'), 'Yes')
    await user.click(screen.getByTestId('save-btn'))
    expect(screen.getByTestId('error-msg')).toBeTruthy()
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-2'))
    expect(screen.queryByTestId('translation-2')).toBeNull()
    expect(screen.getByTestId('total-count').textContent).toBe('3 translations')
  })

  it('error clears after valid save', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('save-btn'))
    expect(screen.getByTestId('error-msg')).toBeTruthy()
    await user.type(screen.getByTestId('source-input'), 'No')
    await user.type(screen.getByTestId('target-input'), 'No')
    await user.click(screen.getByTestId('save-btn'))
    expect(screen.queryByTestId('error-msg')).toBeNull()
  })
})
