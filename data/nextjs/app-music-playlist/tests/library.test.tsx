import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('library', () => {
  it('lists the seeded songs', () => {
    render(<App />)
    const list = screen.getByTestId('song-list')
    expect(within(list).getByTestId('song-s1-title')).toHaveTextContent('Sunrise')
    expect(within(list).getByTestId('song-s2-artist')).toHaveTextContent('Aria')
  })

  it('lists the seeded playlists', () => {
    render(<App />)
    const list = screen.getByTestId('playlist-list')
    expect(within(list).getByTestId('playlist-p1-name')).toHaveTextContent('Favorites')
    expect(within(list).getByTestId('playlist-p2-name')).toHaveTextContent('Chill')
  })

  it('enqueueing a song adds it to the queue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('enqueue-s1'))
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('q-song-s1')).toBeInTheDocument()
  })

  it('enqueueing the same song twice does not duplicate it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('enqueue-s1'))
    await user.click(screen.getByTestId('enqueue-s1'))
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getAllByTestId('q-song-s1')).toHaveLength(1)
  })

  it('opening a playlist navigates to the playlist page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-playlist-p1'))
    expect(screen.getByTestId('page-playlist')).toBeInTheDocument()
    expect(screen.getByTestId('playlist-title')).toHaveTextContent('Favorites')
  })
})
