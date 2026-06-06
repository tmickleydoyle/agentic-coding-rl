import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Score Board', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows 4 seed player rows', () => {
    expect(screen.getAllByTestId('player-row')).toHaveLength(4)
  })

  it('shows all scores starting at 0', () => {
    const scores = screen.getAllByTestId('score')
    scores.forEach(s => expect(s).toHaveTextContent('0'))
  })

  it('shows leader as Tied when all scores are 0', () => {
    expect(screen.getByTestId('leader')).toHaveTextContent('Leader: Tied')
  })

  it('increments a player score', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('player-row')
    await user.click(within(rows[0]).getByRole('button', { name: /^\+$/ }))
    expect(within(rows[0]).getByTestId('score')).toHaveTextContent('1')
  })

  it('updates leader after incrementing', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('player-row')
    await user.click(within(rows[0]).getByRole('button', { name: /^\+$/ }))
    expect(screen.getByTestId('leader')).toHaveTextContent('Leader: Alice')
  })

  it('decrements a player score', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('player-row')
    await user.click(within(rows[0]).getByRole('button', { name: /^\+$/ }))
    await user.click(within(rows[0]).getByRole('button', { name: /^-$/ }))
    expect(within(rows[0]).getByTestId('score')).toHaveTextContent('0')
  })

  it('score does not go below 0', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('player-row')
    await user.click(within(rows[0]).getByRole('button', { name: /^-$/ }))
    expect(within(rows[0]).getByTestId('score')).toHaveTextContent('0')
  })

  it('resets individual player score', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('player-row')
    await user.click(within(rows[0]).getByRole('button', { name: /^\+$/ }))
    await user.click(within(rows[0]).getByRole('button', { name: /^\+$/ }))
    await user.click(within(rows[0]).getByRole('button', { name: /^reset$/i }))
    expect(within(rows[0]).getByTestId('score')).toHaveTextContent('0')
  })

  it('resets all scores', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('player-row')
    await user.click(within(rows[0]).getByRole('button', { name: /^\+$/ }))
    await user.click(within(rows[1]).getByRole('button', { name: /^\+$/ }))
    await user.click(screen.getByRole('button', { name: /reset all/i }))
    const scores = screen.getAllByTestId('score')
    scores.forEach(s => expect(s).toHaveTextContent('0'))
  })

  it('shows Tied when two players share top score', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('player-row')
    await user.click(within(rows[0]).getByRole('button', { name: /^\+$/ }))
    await user.click(within(rows[1]).getByRole('button', { name: /^\+$/ }))
    expect(screen.getByTestId('leader')).toHaveTextContent('Leader: Tied')
  })

  it('adds a new player', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/player name/i), 'Eve')
    await user.click(screen.getByRole('button', { name: /add player/i }))
    expect(screen.getAllByTestId('player-row')).toHaveLength(5)
    expect(screen.getByText('Eve')).toBeInTheDocument()
  })

  it('clears name input after adding player', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/player name/i), 'Eve')
    await user.click(screen.getByRole('button', { name: /add player/i }))
    expect(screen.getByLabelText(/player name/i)).toHaveValue('')
  })

  it('does not add player with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add player/i }))
    expect(screen.getAllByTestId('player-row')).toHaveLength(4)
  })

  it('removes a player', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('player-row')
    await user.click(within(rows[0]).getByRole('button', { name: /remove/i }))
    expect(screen.getAllByTestId('player-row')).toHaveLength(3)
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })
})
