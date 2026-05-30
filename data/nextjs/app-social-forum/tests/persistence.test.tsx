import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('theme + state persistence', () => {
  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('persists a thread upvote across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('upvote-t2'))
    expect(screen.getByTestId('thread-t2-votes')).toHaveTextContent('3')
    await user.click(screen.getByTestId('nav-categories'))
    await user.click(screen.getByTestId('nav-threads'))
    expect(screen.getByTestId('thread-t2-votes')).toHaveTextContent('3')
  })

  it('persists a sort choice across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('sort-select'), 'recent')
    await user.click(screen.getByTestId('nav-categories'))
    await user.click(screen.getByTestId('nav-threads'))
    expect(screen.getByTestId('sort-select')).toHaveValue('recent')
  })
})
