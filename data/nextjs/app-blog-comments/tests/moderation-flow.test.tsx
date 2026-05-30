import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToModeration(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-moderation'))
}

describe('moderation flow', () => {
  it('lists all seeded comments on the moderation page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToModeration(user)
    const list = screen.getByTestId('comment-list')
    expect(within(list).getByText('Great post!')).toBeInTheDocument()
    expect(within(list).getByText('cheap pills')).toBeInTheDocument()
    expect(screen.getByTestId('comment-k1')).toBeInTheDocument()
    expect(screen.getByTestId('comment-k4')).toBeInTheDocument()
  })

  it('approves a pending comment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToModeration(user)
    expect(screen.getByTestId('comment-k2')).toHaveAttribute('data-status', 'pending')
    await user.click(screen.getByTestId('approve-k2'))
    expect(screen.getByTestId('comment-k2')).toHaveAttribute('data-status', 'approved')
  })

  it('marks a comment as spam', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToModeration(user)
    await user.click(screen.getByTestId('spam-k3'))
    expect(screen.getByTestId('comment-k3')).toHaveAttribute('data-status', 'spam')
  })

  it('resets a comment back to pending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToModeration(user)
    await user.click(screen.getByTestId('pending-k1')) // k1 was approved
    expect(screen.getByTestId('comment-k1')).toHaveAttribute('data-status', 'pending')
  })

  it('deletes a comment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToModeration(user)
    expect(screen.getByTestId('comment-k4')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-k4'))
    expect(screen.queryByTestId('comment-k4')).not.toBeInTheDocument()
  })

  it('filters comments by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToModeration(user)
    await user.selectOptions(screen.getByTestId('status-filter'), 'pending')
    expect(screen.getByTestId('comment-k2')).toBeInTheDocument()
    expect(screen.getByTestId('comment-k3')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-k1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('comment-k4')).not.toBeInTheDocument()
  })

  it('shows an empty state when no comments match the filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToModeration(user)
    // delete the only spam comment, then filter spam
    await user.click(screen.getByTestId('remove-k4'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'spam')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-list')).not.toBeInTheDocument()
  })

  it('reflects a status change in the filtered view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToModeration(user)
    await user.selectOptions(screen.getByTestId('status-filter'), 'approved')
    expect(screen.queryByTestId('comment-k2')).not.toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('status-filter'), 'pending')
    await user.click(screen.getByTestId('approve-k2'))
    // after approving, k2 leaves the pending filter
    expect(screen.queryByTestId('comment-k2')).not.toBeInTheDocument()
  })
})

describe('post detail per-post comments', () => {
  it('shows only the selected post comments and their counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    // posts list shows per-post counts
    expect(screen.getByTestId('post-p1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('post-p2-count')).toHaveTextContent('2')
    await user.click(screen.getByTestId('open-p1'))
    expect(screen.getByTestId('comment-k1')).toBeInTheDocument()
    expect(screen.getByTestId('comment-k2')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-k3')).not.toBeInTheDocument()
  })

  it('moderates a comment from the detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p2'))
    await user.click(screen.getByTestId('approve-k3'))
    expect(screen.getByTestId('comment-k3')).toHaveAttribute('data-status', 'approved')
  })
})
