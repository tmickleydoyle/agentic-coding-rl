import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Rock Paper Scissors', () => {
  it('renders the page title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /rock paper scissors/i })).toBeInTheDocument()
  })

  it('shows three choice buttons', () => {
    render(<App />)
    expect(screen.getByTestId('choice-rock')).toBeInTheDocument()
    expect(screen.getByTestId('choice-paper')).toBeInTheDocument()
    expect(screen.getByTestId('choice-scissors')).toBeInTheDocument()
  })

  it('initial scores are all 0', () => {
    render(<App />)
    expect(screen.getByTestId('score-player').textContent).toBe('0')
    expect(screen.getByTestId('score-computer').textContent).toBe('0')
    expect(screen.getByTestId('score-ties').textContent).toBe('0')
  })

  it('no round result shown initially', () => {
    render(<App />)
    expect(screen.queryByTestId('round-result')).not.toBeInTheDocument()
  })

  it('player choice shown after clicking Rock', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0) // Rock index 0
    render(<App />)
    await user.click(screen.getByTestId('choice-rock'))
    expect(screen.getByTestId('player-choice').textContent).toBe('Rock')
    vi.restoreAllMocks()
  })

  it('shows round result after a play', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0.9) // Scissors index 2
    render(<App />)
    await user.click(screen.getByTestId('choice-rock'))
    expect(screen.getByTestId('round-result')).toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('Rock beats Scissors — player wins', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0.9) // index 2 = Scissors
    render(<App />)
    await user.click(screen.getByTestId('choice-rock'))
    expect(screen.getByTestId('computer-choice').textContent).toBe('Scissors')
    expect(screen.getByTestId('round-result').textContent).toBe('You win!')
    expect(screen.getByTestId('score-player').textContent).toBe('1')
    vi.restoreAllMocks()
  })

  it('Scissors beats Paper — player wins', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0.4) // index 1 = Paper
    render(<App />)
    await user.click(screen.getByTestId('choice-scissors'))
    expect(screen.getByTestId('round-result').textContent).toBe('You win!')
    vi.restoreAllMocks()
  })

  it('same choice results in tie', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0) // Rock
    render(<App />)
    await user.click(screen.getByTestId('choice-rock'))
    expect(screen.getByTestId('round-result').textContent).toBe("It's a tie!")
    expect(screen.getByTestId('score-ties').textContent).toBe('1')
    vi.restoreAllMocks()
  })

  it('computer wins when appropriate', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0) // Rock
    render(<App />)
    await user.click(screen.getByTestId('choice-scissors'))
    expect(screen.getByTestId('round-result').textContent).toBe('Computer wins!')
    expect(screen.getByTestId('score-computer').textContent).toBe('1')
    vi.restoreAllMocks()
  })

  it('scores accumulate over multiple rounds', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0.9) // Scissors
    render(<App />)
    await user.click(screen.getByTestId('choice-rock'))
    await user.click(screen.getByTestId('choice-rock'))
    expect(screen.getByTestId('score-player').textContent).toBe('2')
    vi.restoreAllMocks()
  })

  it('Reset clears all scores', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0.9)
    render(<App />)
    await user.click(screen.getByTestId('choice-rock'))
    await user.click(screen.getByTestId('reset-btn'))
    expect(screen.getByTestId('score-player').textContent).toBe('0')
    expect(screen.getByTestId('score-computer').textContent).toBe('0')
    expect(screen.getByTestId('score-ties').textContent).toBe('0')
    vi.restoreAllMocks()
  })

  it('Reset clears round result display', async () => {
    const user = userEvent.setup()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    render(<App />)
    await user.click(screen.getByTestId('choice-rock'))
    await user.click(screen.getByTestId('reset-btn'))
    expect(screen.queryByTestId('round-result')).not.toBeInTheDocument()
    vi.restoreAllMocks()
  })
})
