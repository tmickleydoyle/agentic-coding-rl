import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('submit + rankings', () => {
  it('submits a score and lands on the game detail with it ranked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-submit'))
    await user.selectOptions(screen.getByTestId('game-select'), 'g2')
    await user.type(screen.getByTestId('player-input'), 'Zed')
    await user.type(screen.getByTestId('points-input'), '999')
    await user.click(screen.getByTestId('submit-score'))
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Pac-Man')
    expect(screen.getByTestId('score-s7-player')).toHaveTextContent('Zed')
    expect(screen.getByTestId('score-s7-rank')).toHaveTextContent('1')
  })

  it('shows an error and stays when the player name is blank', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-submit'))
    await user.type(screen.getByTestId('points-input'), '100')
    await user.click(screen.getByTestId('submit-score'))
    expect(screen.getByTestId('submit-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-submit')).toBeInTheDocument()
  })

  it('shows an error for negative points', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-submit'))
    await user.type(screen.getByTestId('player-input'), 'Neg')
    await user.type(screen.getByTestId('points-input'), '-5')
    await user.click(screen.getByTestId('submit-score'))
    expect(screen.getByTestId('submit-error')).toBeInTheDocument()
  })

  it('rankings list ranks all scores and shows stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-rankings'))
    expect(screen.getByTestId('stat-scores')).toHaveTextContent('6')
    expect(screen.getByTestId('stat-players')).toHaveTextContent('4')
    const list = screen.getByTestId('rank-list')
    const first = list.querySelector('li')
    expect(first).toHaveAttribute('data-testid', 'rank-s3')
  })

  it('rankings filter narrows to one game', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-rankings'))
    await user.selectOptions(screen.getByTestId('filter-select'), 'g2')
    expect(screen.getByTestId('rank-s4')).toBeInTheDocument()
    expect(screen.getByTestId('rank-s5')).toBeInTheDocument()
    expect(screen.queryByTestId('rank-s3')).toBeNull()
  })
})
