import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('artists and favorites', () => {
  it('lists artists with their album counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-artists'))
    const list = screen.getByTestId('artist-list')
    expect(within(list).getByTestId('artist-Aria-count')).toHaveTextContent('2')
    expect(within(list).getByTestId('artist-Echo-count')).toHaveTextContent('2')
  })

  it('viewing an artist filters the albums list to that artist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-artists'))
    await user.click(screen.getByTestId('view-Echo'))
    expect(screen.getByTestId('page-albums')).toBeInTheDocument()
    expect(screen.getByTestId('album-a3')).toBeInTheDocument()
    expect(screen.queryByTestId('album-a1')).not.toBeInTheDocument()
  })

  it('shows the seeded favorites and the average rating', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favorite-a1')).toBeInTheDocument()
    expect(screen.getByTestId('favorite-a4')).toBeInTheDocument()
    // rated albums a1=5, a3=4 -> avg 4.5
    expect(screen.getByTestId('avg-rating')).toHaveTextContent('4.5')
  })

  it('removing a favorite drops it from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    await user.click(screen.getByTestId('unfav-a1'))
    expect(screen.queryByTestId('favorite-a1')).not.toBeInTheDocument()
    expect(screen.getByTestId('favorite-a4')).toBeInTheDocument()
  })

  it('shows favorites-empty when all favorites are removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    await user.click(screen.getByTestId('unfav-a1'))
    await user.click(screen.getByTestId('unfav-a4'))
    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('favorites-list')).not.toBeInTheDocument()
  })
})
