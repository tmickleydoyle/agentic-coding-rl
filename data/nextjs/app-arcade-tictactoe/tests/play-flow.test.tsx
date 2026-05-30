import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('play flow', () => {
  it('plays X then the AI responds at the center', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cell-0'))
    expect(screen.getByTestId('cell-0')).toHaveTextContent('X')
    expect(screen.getByTestId('cell-4')).toHaveTextContent('O')
  })

  it('disables a cell once it is occupied', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cell-0'))
    expect(screen.getByTestId('cell-0')).toBeDisabled()
    expect(screen.getByTestId('cell-4')).toBeDisabled()
  })

  it('lets X win and reports the result, locking the board', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (const i of [0, 7, 6, 8]) {
      await user.click(screen.getByTestId(`cell-${i}`))
    }
    expect(screen.getByTestId('status')).toHaveTextContent('X wins')
    // all cells disabled once the game is over
    expect(screen.getByTestId('cell-3')).toBeDisabled()
  })

  it('records the win in the score tally', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (const i of [0, 7, 6, 8]) {
      await user.click(screen.getByTestId(`cell-${i}`))
    }
    await user.click(screen.getByTestId('nav-scores'))
    expect(screen.getByTestId('tally-x')).toHaveTextContent('1')
    expect(screen.getByTestId('tally-games')).toHaveTextContent('1')
  })

  it('lets the AI win when X plays into the trap', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (const i of [0, 1, 3]) {
      await user.click(screen.getByTestId(`cell-${i}`))
    }
    expect(screen.getByTestId('status')).toHaveTextContent('O wins')
    await user.click(screen.getByTestId('nav-scores'))
    expect(screen.getByTestId('tally-o')).toHaveTextContent('1')
  })

  it('can reach a draw and tally it', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (const i of [0, 1, 6, 5, 7]) {
      await user.click(screen.getByTestId(`cell-${i}`))
    }
    expect(screen.getByTestId('status')).toHaveTextContent('Draw')
    await user.click(screen.getByTestId('nav-scores'))
    expect(screen.getByTestId('tally-draws')).toHaveTextContent('1')
  })

  it('reset clears the board back to your turn', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cell-0'))
    await user.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('status')).toHaveTextContent('Your turn')
    expect(screen.getByTestId('cell-0')).toHaveTextContent('')
    expect(screen.getByTestId('cell-4')).toHaveTextContent('')
  })

  it('clear-scores zeros the tally', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (const i of [0, 7, 6, 8]) {
      await user.click(screen.getByTestId(`cell-${i}`))
    }
    await user.click(screen.getByTestId('nav-scores'))
    expect(screen.getByTestId('tally-x')).toHaveTextContent('1')
    await user.click(screen.getByTestId('clear-scores'))
    expect(screen.getByTestId('tally-x')).toHaveTextContent('0')
    expect(screen.getByTestId('tally-games')).toHaveTextContent('0')
  })
})
