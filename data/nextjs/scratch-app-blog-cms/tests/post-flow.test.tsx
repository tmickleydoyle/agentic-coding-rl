import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToPosts(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-posts'))
}

describe('post flow', () => {
  it('lists seeded posts on the posts page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPosts(user)
    const list = screen.getByTestId('post-list')
    expect(within(list).getByText('Hello World')).toBeInTheDocument()
    expect(within(list).getByText('Design Systems')).toBeInTheDocument()
    expect(within(list).getByText('We are hiring')).toBeInTheDocument()
  })

  it('blocks saving a post with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-editor'))
    await user.click(screen.getByTestId('submit-post'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-editor')).toBeInTheDocument()
  })

  it('adds a post and navigates to the posts list where it appears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-editor'))
    await user.type(screen.getByTestId('title-input'), 'Release Notes')
    await user.click(screen.getByTestId('submit-post'))
    expect(screen.getByTestId('page-posts')).toBeInTheDocument()
    expect(within(screen.getByTestId('post-list')).getByText('Release Notes')).toBeInTheDocument()
  })

  it('defaults a new post to draft status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-editor'))
    await user.type(screen.getByTestId('title-input'), 'Quiet Draft')
    await user.click(screen.getByTestId('submit-post'))
    const list = screen.getByTestId('post-list')
    const row = within(list).getByText('Quiet Draft').closest('li')
    expect(row).toHaveAttribute('data-status', 'draft')
  })

  it('toggles publish status on a post', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPosts(user)
    const row = screen.getByTestId('post-b2') // Design Systems is draft
    expect(row).toHaveAttribute('data-status', 'draft')
    await user.click(screen.getByTestId('publish-b2'))
    expect(screen.getByTestId('post-b2')).toHaveAttribute('data-status', 'published')
    await user.click(screen.getByTestId('publish-b2'))
    expect(screen.getByTestId('post-b2')).toHaveAttribute('data-status', 'draft')
  })

  it('deletes a post', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPosts(user)
    expect(screen.getByTestId('post-b3')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-b3'))
    expect(screen.queryByTestId('post-b3')).not.toBeInTheDocument()
  })

  it('filters posts by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPosts(user)
    await user.selectOptions(screen.getByTestId('status-filter'), 'draft')
    expect(screen.getByTestId('post-b2')).toBeInTheDocument()
    expect(screen.queryByTestId('post-b1')).not.toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('status-filter'), 'published')
    expect(screen.getByTestId('post-b1')).toBeInTheDocument()
    expect(screen.queryByTestId('post-b2')).not.toBeInTheDocument()
  })

  it('filters posts by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPosts(user)
    await user.selectOptions(screen.getByTestId('category-filter'), 'c2') // Design
    expect(screen.getByTestId('post-b2')).toBeInTheDocument()
    expect(screen.queryByTestId('post-b1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('post-b3')).not.toBeInTheDocument()
  })

  it('shows an empty state when no posts match the filters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPosts(user)
    await user.selectOptions(screen.getByTestId('category-filter'), 'c2')
    await user.selectOptions(screen.getByTestId('status-filter'), 'published')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('post-list')).not.toBeInTheDocument()
  })
})
