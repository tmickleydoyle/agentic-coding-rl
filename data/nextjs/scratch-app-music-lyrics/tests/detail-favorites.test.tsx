import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('detail and favorite lines', () => {
  it('shows the lyric lines of a song', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    expect(screen.getByTestId('line-0-text')).toHaveTextContent('We ride at dawn')
    expect(screen.getByTestId('line-2-text')).toHaveTextContent('Open road ahead')
  })

  it('favoriting a line toggles its button label', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    expect(screen.getByTestId('fav-line-0')).toHaveTextContent('Favorite')
    await user.click(screen.getByTestId('fav-line-0'))
    expect(screen.getByTestId('fav-line-0')).toHaveTextContent('Unfavorite')
  })

  it('favorited lines appear on the favorites page with count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    await user.click(screen.getByTestId('fav-line-0'))
    await user.click(screen.getByTestId('fav-line-2'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('fav-count')).toHaveTextContent('2')
    expect(screen.getByTestId('favline-g1-0-text')).toHaveTextContent('We ride at dawn')
    expect(screen.getByTestId('favline-g1-0-song')).toHaveTextContent('Open Road')
    expect(screen.getByTestId('favline-g1-2')).toBeInTheDocument()
  })

  it('removing a favorite from the favorites page drops it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    await user.click(screen.getByTestId('fav-line-0'))
    await user.click(screen.getByTestId('nav-favorites'))
    await user.click(screen.getByTestId('remove-g1-0'))
    expect(screen.getByTestId('fav-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('fav-list')).not.toBeInTheDocument()
  })

  it('favorite state persists and toggling off on detail removes from favorites', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    await user.click(screen.getByTestId('fav-line-1'))
    await user.click(screen.getByTestId('nav-songs'))
    await user.click(screen.getByTestId('open-g1'))
    expect(screen.getByTestId('fav-line-1')).toHaveTextContent('Unfavorite')
    await user.click(screen.getByTestId('fav-line-1'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('fav-empty')).toBeInTheDocument()
  })

  it('favorites from two different songs are kept distinct', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    await user.click(screen.getByTestId('fav-line-0'))
    await user.click(screen.getByTestId('nav-songs'))
    await user.click(screen.getByTestId('open-g3'))
    await user.click(screen.getByTestId('fav-line-0'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favline-g1-0')).toBeInTheDocument()
    expect(screen.getByTestId('favline-g3-0')).toBeInTheDocument()
    expect(screen.getByTestId('fav-count')).toHaveTextContent('2')
  })
})
