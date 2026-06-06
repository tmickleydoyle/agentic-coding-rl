import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Number Guessing Game', () => {
  it('renders the page title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /number guessing game/i })).toBeInTheDocument()
  })

  it('shows initial feedback message', () => {
    render(<App />)
    expect(screen.getByTestId('feedback').textContent).toBe('Guess a number between 1 and 100.')
  })

  it('starts with 10 guesses remaining', () => {
    render(<App />)
    expect(screen.getByTestId('guesses-remaining').textContent).toBe('10')
  })

  it('no guess history initially', () => {
    render(<App />)
    expect(screen.queryAllByTestId('guess-history-item')).toHaveLength(0)
  })

  it('shows "Too low!" feedback for low guess', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // secret = 51
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/your guess/i), '10')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))
    expect(screen.getByTestId('feedback').textContent).toBe('Too low! Try higher.')
    vi.restoreAllMocks()
  })

  it('shows "Too high!" feedback for high guess', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // secret = 51
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/your guess/i), '90')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))
    expect(screen.getByTestId('feedback').textContent).toBe('Too high! Try lower.')
    vi.restoreAllMocks()
  })

  it('shows correct message on right guess', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // secret = 51
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/your guess/i), '51')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))
    expect(screen.getByTestId('feedback').textContent).toMatch(/correct/i)
    expect(screen.getByTestId('feedback').textContent).toContain('1 guess(es)')
    vi.restoreAllMocks()
  })

  it('decrements guesses remaining on valid guess', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/your guess/i), '10')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))
    expect(screen.getByTestId('guesses-remaining').textContent).toBe('9')
    vi.restoreAllMocks()
  })

  it('adds guess to history', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/your guess/i), '25')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))
    const items = screen.getAllByTestId('guess-history-item')
    expect(items).toHaveLength(1)
    expect(items[0].textContent).toBe('25')
    vi.restoreAllMocks()
  })

  it('clears input after valid guess', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/your guess/i), '25')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))
    expect(screen.getByLabelText(/your guess/i)).toHaveValue(null)
    vi.restoreAllMocks()
  })

  it('shows validation error for empty guess', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^guess$/i }))
    expect(screen.getByTestId('validation-error')).toBeInTheDocument()
    expect(screen.getByTestId('guesses-remaining').textContent).toBe('10')
  })

  it('shows validation error for out-of-range guess', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/your guess/i), '150')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))
    expect(screen.getByTestId('validation-error')).toBeInTheDocument()
    expect(screen.getByTestId('guesses-remaining').textContent).toBe('10')
  })

  it('New Game resets state', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/your guess/i), '25')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))
    await user.click(screen.getByTestId('new-game-btn'))
    expect(screen.getByTestId('guesses-remaining').textContent).toBe('10')
    expect(screen.getByTestId('feedback').textContent).toBe('Guess a number between 1 and 100.')
    expect(screen.queryAllByTestId('guess-history-item')).toHaveLength(0)
    vi.restoreAllMocks()
  })
})
