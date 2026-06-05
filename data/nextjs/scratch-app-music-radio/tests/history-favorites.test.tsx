import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('history and favorites', () => {
  it('shows history-empty and the seeded total plays', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-empty')).toBeInTheDocument()
    // 5 + 2 + 0 + 8 = 15
    expect(screen.getByTestId('total-plays')).toHaveTextContent('15')
  })

  it('records plays most-recent-first in history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('play-r1'))
    await user.click(screen.getByTestId('play-r2'))
    await user.click(screen.getByTestId('nav-history'))
    const items = screen.getAllByTestId(/^hist-r\d$/)
    expect(items[0]).toHaveAttribute('data-testid', 'hist-r2')
    expect(items[1]).toHaveAttribute('data-testid', 'hist-r1')
  })

  it('does not duplicate a re-played station in history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('play-r1'))
    await user.click(screen.getByTestId('play-r2'))
    await user.click(screen.getByTestId('play-r1'))
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getAllByTestId('hist-r1')).toHaveLength(1)
    const items = screen.getAllByTestId(/^hist-r\d$/)
    expect(items[0]).toHaveAttribute('data-testid', 'hist-r1')
  })

  it('clears the history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('play-r1'))
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('clear-history'))
    expect(screen.getByTestId('history-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument()
  })

  it('shows seeded favorites and removes one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    const list = screen.getByTestId('favorites-list')
    expect(within(list).getByTestId('favorite-r1')).toBeInTheDocument()
    expect(within(list).getByTestId('favorite-r3')).toBeInTheDocument()
    await user.click(screen.getByTestId('unfav-r1'))
    expect(screen.queryByTestId('favorite-r1')).not.toBeInTheDocument()
  })
})
