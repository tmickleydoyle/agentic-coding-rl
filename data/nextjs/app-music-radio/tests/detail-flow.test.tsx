import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('station detail flow', () => {
  it('shows station details', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r1'))
    expect(screen.getByTestId('detail-genre')).toHaveTextContent('jazz')
    expect(screen.getByTestId('detail-bitrate')).toHaveTextContent('128')
    expect(screen.getByTestId('detail-plays')).toHaveTextContent('5')
  })

  it('playing from detail increments the play count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r3'))
    expect(screen.getByTestId('detail-plays')).toHaveTextContent('0')
    await user.click(screen.getByTestId('play-station'))
    expect(screen.getByTestId('detail-plays')).toHaveTextContent('1')
    expect(screen.getByTestId('now-playing')).toHaveTextContent('Now playing: Chill Hub')
  })

  it('stopping clears now-playing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r3'))
    await user.click(screen.getByTestId('play-station'))
    await user.click(screen.getByTestId('stop-station'))
    expect(screen.getByTestId('now-playing')).toHaveTextContent('Nothing playing')
  })

  it('toggling favorite on detail reflects on favorites page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r2'))
    await user.click(screen.getByTestId('toggle-fav'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favorite-r2')).toBeInTheDocument()
  })

  it('play count persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r3'))
    await user.click(screen.getByTestId('play-station'))
    await user.click(screen.getByTestId('nav-stations'))
    await user.click(screen.getByTestId('open-r3'))
    expect(screen.getByTestId('detail-plays')).toHaveTextContent('1')
  })
})
