import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('stations list', () => {
  it('lists the seeded stations', () => {
    render(<App />)
    const list = screen.getByTestId('station-list')
    expect(within(list).getByTestId('station-r1-name')).toHaveTextContent('Jazz FM')
    expect(within(list).getByTestId('station-r2-genre')).toHaveTextContent('rock')
  })

  it('filters by genre', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('genre-filter'), 'jazz')
    expect(screen.getByTestId('station-r1')).toBeInTheDocument()
    expect(screen.queryByTestId('station-r2')).not.toBeInTheDocument()
  })

  it('shows empty state when no station matches the filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('genre-filter'), 'talk')
    expect(screen.getByTestId('station-r4')).toBeInTheDocument()
    expect(screen.queryByTestId('station-r1')).not.toBeInTheDocument()
  })

  it('playing a station updates now-playing in the chrome', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('play-r2'))
    expect(screen.getByTestId('now-playing')).toHaveTextContent('Now playing: Rock Wave')
  })

  it('favoriting from the list adds it to favorites', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('fav-r2'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favorite-r2')).toBeInTheDocument()
  })

  it('opening a station navigates to detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r3'))
    expect(screen.getByTestId('page-station-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Chill Hub')
  })
})
