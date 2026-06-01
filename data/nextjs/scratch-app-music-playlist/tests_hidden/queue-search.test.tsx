import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('queue and search', () => {
  it('shows queue-empty initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('queue-empty')).toBeInTheDocument()
    expect(screen.getByTestId('queue-duration')).toHaveTextContent('0')
  })

  it('totals the queue duration', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('enqueue-s1'))
    await user.click(screen.getByTestId('enqueue-s3'))
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('queue-duration')).toHaveTextContent('390')
  })

  it('toggles shuffle on and off', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('shuffle-toggle')).toHaveTextContent('Shuffle: Off')
    await user.click(screen.getByTestId('shuffle-toggle'))
    expect(screen.getByTestId('shuffle-toggle')).toHaveTextContent('Shuffle: On')
  })

  it('removes a song from the queue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('enqueue-s1'))
    await user.click(screen.getByTestId('nav-queue'))
    await user.click(screen.getByTestId('remove-q-s1'))
    expect(screen.getByTestId('queue-empty')).toBeInTheDocument()
  })

  it('searches by title (case-insensitive)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'PULSE')
    expect(screen.getByTestId('result-s4')).toBeInTheDocument()
    expect(screen.queryByTestId('result-s1')).not.toBeInTheDocument()
  })

  it('searches by artist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'echo')
    expect(screen.getByTestId('result-s3')).toBeInTheDocument()
    expect(screen.getByTestId('result-s4')).toBeInTheDocument()
    expect(screen.queryByTestId('result-s1')).not.toBeInTheDocument()
  })

  it('shows search-empty when nothing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'zzz')
    expect(screen.getByTestId('search-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })

  it('enqueues from search results', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'sunrise')
    await user.click(screen.getByTestId('enqueue-result-s1'))
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('q-song-s1')).toBeInTheDocument()
  })
})
