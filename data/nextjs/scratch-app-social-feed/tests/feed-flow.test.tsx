import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('feed flow', () => {
  it('lists seeded posts in the feed', () => {
    render(<App />)
    const list = screen.getByTestId('feed-list')
    expect(within(list).getByText('Hello world')).toBeInTheDocument()
    expect(within(list).getByText('Shipped a feature')).toBeInTheDocument()
    expect(within(list).getByText('Coffee then code')).toBeInTheDocument()
  })

  it('shows the seeded like count for a post', () => {
    render(<App />)
    expect(screen.getByTestId('post-p1-likes')).toHaveTextContent('3')
  })

  it('likes a post and increments the count', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('post-p1-likes')).toHaveTextContent('3')
    await user.click(screen.getByTestId('like-p1'))
    expect(screen.getByTestId('post-p1-likes')).toHaveTextContent('4')
  })

  it('unlikes an already-liked post and decrements the count', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('post-p2-likes')).toHaveTextContent('1')
    await user.click(screen.getByTestId('like-p2'))
    expect(screen.getByTestId('post-p2-likes')).toHaveTextContent('0')
  })

  it('filters the feed to following only', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('feed-filter'), 'following')
    // following = [u2]; plus own posts (u1). p1 (u2) and p3 (u1) show, p2 (u3) hidden.
    expect(screen.getByTestId('post-p1')).toBeInTheDocument()
    expect(screen.getByTestId('post-p3')).toBeInTheDocument()
    expect(screen.queryByTestId('post-p2')).not.toBeInTheDocument()
  })

  it('shows an empty state when following nobody and no own posts match', async () => {
    const user = userEvent.setup()
    render(<App />)
    // unfollow Ada via explore
    await user.click(screen.getByTestId('nav-explore'))
    await user.click(screen.getByTestId('follow-u2'))
    await user.click(screen.getByTestId('nav-feed'))
    await user.selectOptions(screen.getByTestId('feed-filter'), 'following')
    // only own post p3 remains visible (u1), so list is NOT empty
    expect(screen.getByTestId('post-p3')).toBeInTheDocument()
    expect(screen.queryByTestId('post-p1')).not.toBeInTheDocument()
  })

  it('opens a post detail from the feed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    expect(screen.getByTestId('page-post')).toBeInTheDocument()
    expect(screen.getByTestId('detail-text')).toHaveTextContent('Hello world')
  })

  it('opens an author profile from the feed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('author-p1'))
    expect(screen.getByTestId('page-profile')).toBeInTheDocument()
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Ada')
  })
})
