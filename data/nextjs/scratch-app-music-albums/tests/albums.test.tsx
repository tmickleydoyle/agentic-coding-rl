import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('albums list', () => {
  it('lists the seeded albums', () => {
    render(<App />)
    const list = screen.getByTestId('album-list')
    expect(within(list).getByTestId('album-a1-title')).toHaveTextContent('Dawn')
    expect(within(list).getByTestId('album-a1-artist')).toHaveTextContent('Aria')
    expect(within(list).getByTestId('album-a1-rating')).toHaveTextContent('5')
  })

  it('filters by artist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('artist-filter'), 'Echo')
    expect(screen.getByTestId('album-a3')).toBeInTheDocument()
    expect(screen.getByTestId('album-a4')).toBeInTheDocument()
    expect(screen.queryByTestId('album-a1')).not.toBeInTheDocument()
  })

  it('favoriting from the list adds it to favorites', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('fav-a2'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favorite-a2')).toBeInTheDocument()
  })

  it('opening an album navigates to detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-a3'))
    expect(screen.getByTestId('page-album-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Currents')
  })
})
