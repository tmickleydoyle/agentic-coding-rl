import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('songs list', () => {
  it('lists the seeded songs with line counts', () => {
    render(<App />)
    const list = screen.getByTestId('song-list')
    expect(within(list).getByTestId('song-g1-title')).toHaveTextContent('Open Road')
    expect(within(list).getByTestId('song-g1-artist')).toHaveTextContent('Aria')
    expect(within(list).getByTestId('song-g1-linecount')).toHaveTextContent('3')
    expect(within(list).getByTestId('song-g2-linecount')).toHaveTextContent('2')
  })

  it('filters by artist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('artist-filter'), 'Echo')
    expect(screen.getByTestId('song-g3')).toBeInTheDocument()
    expect(screen.queryByTestId('song-g1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('song-g2')).not.toBeInTheDocument()
  })

  it('opening a song navigates to detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g3'))
    expect(screen.getByTestId('page-song-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('City Lights')
  })

  it('the view-artist button filters songs to that artist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    await user.click(screen.getByTestId('view-artist'))
    expect(screen.getByTestId('page-songs')).toBeInTheDocument()
    expect(screen.getByTestId('song-g1')).toBeInTheDocument()
    expect(screen.getByTestId('song-g2')).toBeInTheDocument()
    expect(screen.queryByTestId('song-g3')).not.toBeInTheDocument()
  })
})
