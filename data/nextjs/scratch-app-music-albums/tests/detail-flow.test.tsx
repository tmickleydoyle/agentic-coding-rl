import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('album detail flow', () => {
  it('shows album details and total track length', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-a1'))
    expect(screen.getByTestId('detail-artist')).toHaveTextContent('Aria')
    expect(screen.getByTestId('detail-year')).toHaveTextContent('2019')
    expect(screen.getByTestId('detail-rating')).toHaveTextContent('5')
    expect(screen.getByTestId('detail-total-length')).toHaveTextContent('380')
    expect(screen.getByTestId('track-t1-title')).toHaveTextContent('Wake')
    expect(screen.getByTestId('track-t2-length')).toHaveTextContent('180')
  })

  it('rates an album and the new rating shows on the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-a2'))
    expect(screen.getByTestId('detail-rating')).toHaveTextContent('0')
    await user.click(screen.getByTestId('rate-3'))
    expect(screen.getByTestId('detail-rating')).toHaveTextContent('3')
    await user.click(screen.getByTestId('nav-albums'))
    expect(screen.getByTestId('album-a2-rating')).toHaveTextContent('3')
  })

  it('toggles favorite on detail and reflects on favorites page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-a2'))
    await user.click(screen.getByTestId('toggle-fav'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favorite-a2')).toBeInTheDocument()
  })

  it('rating persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-a4'))
    await user.click(screen.getByTestId('rate-2'))
    await user.click(screen.getByTestId('nav-albums'))
    await user.click(screen.getByTestId('open-a4'))
    expect(screen.getByTestId('detail-rating')).toHaveTextContent('2')
  })
})
