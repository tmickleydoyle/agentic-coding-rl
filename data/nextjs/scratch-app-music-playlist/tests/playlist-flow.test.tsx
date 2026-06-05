import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('playlist flow', () => {
  it('shows the seeded song in a playlist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-playlist-p1'))
    expect(screen.getByTestId('pl-song-s2-title')).toHaveTextContent('Night Drive')
  })

  it('shows playlist-empty for an empty playlist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-playlist-p2'))
    expect(screen.getByTestId('playlist-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('playlist-songs')).not.toBeInTheDocument()
  })

  it('adds a song to a playlist via the select', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-playlist-p2'))
    await user.selectOptions(screen.getByTestId('add-song-select'), 's1')
    expect(screen.getByTestId('pl-song-s1')).toBeInTheDocument()
    expect(screen.queryByTestId('playlist-empty')).not.toBeInTheDocument()
  })

  it('added song no longer appears as an option to add', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-playlist-p2'))
    await user.selectOptions(screen.getByTestId('add-song-select'), 's1')
    const select = screen.getByTestId('add-song-select') as HTMLSelectElement
    const values = Array.from(select.options).map((o) => o.value)
    expect(values).not.toContain('s1')
  })

  it('removes a song from a playlist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-playlist-p1'))
    await user.click(screen.getByTestId('remove-s2'))
    expect(screen.queryByTestId('pl-song-s2')).not.toBeInTheDocument()
    expect(screen.getByTestId('playlist-empty')).toBeInTheDocument()
  })

  it('a song already in the playlist is not offered in the add select', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-playlist-p1'))
    const select = screen.getByTestId('add-song-select') as HTMLSelectElement
    const values = Array.from(select.options).map((o) => o.value)
    expect(values).not.toContain('s2')
    expect(values).toContain('s1')
  })
})
