import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('reader', () => {
  it('shows a no-series message before a series is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reader'))
    expect(screen.getByTestId('no-series')).toBeInTheDocument()
  })

  it('reads through to the reader and marks the opened part read', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    expect(screen.getByTestId('part-x3')).toHaveAttribute('data-read', 'false')
    await user.click(screen.getByTestId('open-reader-x3'))
    expect(screen.getByTestId('page-reader')).toBeInTheDocument()
    expect(screen.getByTestId('reader-part-x3')).toHaveAttribute('data-read', 'true')
  })

  it('shows the read-of-total progress on the reader', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s2'))
    await user.click(screen.getByTestId('nav-reader'))
    // s2: 1 of 3 read at seed
    expect(screen.getByTestId('reader-progress')).toHaveTextContent('read 1 of 3')
  })

  it('lists the reader parts in order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s2'))
    await user.click(screen.getByTestId('nav-reader'))
    const list = screen.getByTestId('reader-list')
    const items = within(list).getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('data-testid', 'reader-part-x4')
    expect(items[2]).toHaveAttribute('data-testid', 'reader-part-x6')
  })

  it('reader progress increases after marking a part read via the reader entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s2'))
    await user.click(screen.getByTestId('open-reader-x5'))
    expect(screen.getByTestId('reader-progress')).toHaveTextContent('read 2 of 3')
  })
})
