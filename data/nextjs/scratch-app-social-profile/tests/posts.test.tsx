import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('posts page', () => {
  it('lists my posts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-posts'))
    const list = screen.getByTestId('post-list')
    expect(within(list).getByText('First post')).toBeInTheDocument()
    expect(within(list).getByText('Hello followers')).toBeInTheDocument()
    expect(within(list).queryByText('Design tips')).not.toBeInTheDocument()
  })

  it('shows another users posts after viewing them', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    await user.click(screen.getByTestId('view-u2'))
    await user.click(screen.getByTestId('nav-posts'))
    expect(within(screen.getByTestId('post-list')).getByText('Design tips')).toBeInTheDocument()
    expect(screen.queryByText('First post')).not.toBeInTheDocument()
  })

  it('shows an empty state for a user with no posts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    await user.click(screen.getByTestId('view-u3')) // Zoe has no posts
    await user.click(screen.getByTestId('nav-posts'))
    expect(screen.getByTestId('empty-posts')).toBeInTheDocument()
    expect(screen.queryByTestId('post-list')).not.toBeInTheDocument()
  })
})
