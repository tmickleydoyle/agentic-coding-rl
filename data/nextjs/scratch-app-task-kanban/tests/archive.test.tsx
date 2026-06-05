import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('archive', () => {
  it('shows an empty archive initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-archive'))
    expect(screen.getByTestId('empty-archive')).toBeInTheDocument()
    expect(screen.queryByTestId('archive-list')).not.toBeInTheDocument()
  })

  it('archives a card from the board, moving it to the archive page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('archive-c1'))
    expect(screen.queryByTestId('card-c1')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('nav-archive'))
    expect(screen.getByTestId('archive-list')).toBeInTheDocument()
    expect(screen.getByTestId('archived-c1')).toBeInTheDocument()
  })

  it('restores a card back onto the board in its original column', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('archive-c2')) // c2 is in doing
    await user.click(screen.getByTestId('nav-archive'))
    await user.click(screen.getByTestId('restore-c2'))
    expect(screen.getByTestId('empty-archive')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('card-c2')).toHaveAttribute('data-column', 'doing')
  })
})
