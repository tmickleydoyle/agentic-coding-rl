import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Pronunciation Log', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: 'Pronunciation Log' })).toBeTruthy()
  })

  it('shows 3 seed entries', () => {
    expect(screen.getByTestId('entry-1')).toBeTruthy()
    expect(screen.getByTestId('entry-2')).toBeTruthy()
    expect(screen.getByTestId('entry-3')).toBeTruthy()
  })

  it('entry count shows 3 entries initially', () => {
    expect(screen.getByTestId('entry-count').textContent).toBe('3 entries')
  })

  it('average rating shows 4.00 initially', () => {
    expect(screen.getByTestId('average-rating').textContent).toContain('4.00')
  })

  it('shows word for seed entry', () => {
    expect(screen.getByTestId('entry-word-1').textContent).toBe('Bonjour')
  })

  it('shows rating for seed entry', () => {
    expect(screen.getByTestId('entry-rating-2').textContent).toBe('5')
  })

  it('shows notes for seed entry', () => {
    expect(screen.getByTestId('entry-notes-3').textContent).toBe('Need more practice')
  })

  it('no error msg initially', () => {
    expect(screen.queryByTestId('error-msg')).toBeNull()
  })

  it('adds a new entry', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('word-input'), 'Ciao')
    await user.clear(screen.getByTestId('rating-input'))
    await user.type(screen.getByTestId('rating-input'), '4')
    await user.type(screen.getByTestId('notes-input'), 'Good job')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('entry-count').textContent).toBe('4 entries')
  })

  it('clears form fields after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('word-input'), 'Ciao')
    await user.clear(screen.getByTestId('rating-input'))
    await user.type(screen.getByTestId('rating-input'), '3')
    await user.click(screen.getByTestId('add-btn'))
    expect((screen.getByTestId('word-input') as HTMLInputElement).value).toBe('')
  })

  it('shows error when word is empty', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByTestId('rating-input'))
    await user.type(screen.getByTestId('rating-input'), '3')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('error-msg').textContent).toContain('Please enter a valid word and rating (1-5).')
  })

  it('shows error when rating is out of range', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('word-input'), 'Hola')
    await user.clear(screen.getByTestId('rating-input'))
    await user.type(screen.getByTestId('rating-input'), '6')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('error-msg')).toBeTruthy()
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-1'))
    expect(screen.queryByTestId('entry-1')).toBeNull()
    expect(screen.getByTestId('entry-count').textContent).toBe('2 entries')
  })

  it('average updates after delete', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-1'))
    // remaining: 5, 3 -> avg 4.00
    expect(screen.getByTestId('average-rating').textContent).toContain('4.00')
  })

  it('shows N/A when all entries deleted', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-1'))
    await user.click(screen.getByTestId('delete-2'))
    await user.click(screen.getByTestId('delete-3'))
    expect(screen.getByTestId('average-rating').textContent).toContain('N/A')
  })

  it('error clears after valid add', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('error-msg')).toBeTruthy()
    await user.type(screen.getByTestId('word-input'), 'Grazie')
    await user.clear(screen.getByTestId('rating-input'))
    await user.type(screen.getByTestId('rating-input'), '5')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.queryByTestId('error-msg')).toBeNull()
  })
})
