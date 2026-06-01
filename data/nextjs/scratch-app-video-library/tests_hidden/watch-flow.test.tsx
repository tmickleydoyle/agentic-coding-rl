import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openV1(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('open-v1'))
}

describe('watch + watchlist flow', () => {
  it('marks a video watched and shows the flag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openV1(user)
    expect(screen.queryByTestId('watched-flag')).not.toBeInTheDocument()
    expect(screen.getByTestId('watch-btn')).toHaveTextContent('Mark watched')
    await user.click(screen.getByTestId('watch-btn'))
    expect(screen.getByTestId('watched-flag')).toBeInTheDocument()
    expect(screen.getByTestId('watch-btn')).toHaveTextContent('Watched')
  })

  it('adds and removes from the watchlist via the detail toggle', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openV1(user)
    expect(screen.getByTestId('watchlist-toggle')).toHaveTextContent('Add to watchlist')
    await user.click(screen.getByTestId('watchlist-toggle'))
    expect(screen.getByTestId('watchlist-toggle')).toHaveTextContent('Remove from watchlist')
    await user.click(screen.getByTestId('watchlist-toggle'))
    expect(screen.getByTestId('watchlist-toggle')).toHaveTextContent('Add to watchlist')
  })

  it('saved video appears on the watchlist page and can be removed there', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openV1(user)
    await user.click(screen.getByTestId('watchlist-toggle'))
    await user.click(screen.getByTestId('nav-watchlist'))
    expect(screen.getByTestId('wl-v1-title')).toHaveTextContent('Intro to Hooks')
    await user.click(screen.getByTestId('wl-remove-v1'))
    expect(screen.getByTestId('empty-watchlist')).toBeInTheDocument()
  })

  it('shows empty-watchlist when nothing saved', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-watchlist'))
    expect(screen.getByTestId('empty-watchlist')).toBeInTheDocument()
  })

  it('marking watched twice does not duplicate in history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openV1(user)
    await user.click(screen.getByTestId('watch-btn'))
    await user.click(screen.getByTestId('watch-btn'))
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('watched-count-value')).toHaveTextContent('1')
  })
})
