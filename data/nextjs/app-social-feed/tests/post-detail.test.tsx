import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('post detail', () => {
  it('shows a no-post message when navigating directly without selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-post'))
    expect(screen.getByTestId('no-post-selected')).toBeInTheDocument()
  })

  it('lists seeded comments on the selected post', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    const list = screen.getByTestId('comment-list')
    expect(within(list).getByText('Nice!')).toBeInTheDocument()
    expect(within(list).getByText('Welcome')).toBeInTheDocument()
    expect(within(list).queryByText('Congrats')).not.toBeInTheDocument()
  })

  it('adds a comment to the post', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    await user.type(screen.getByTestId('comment-input'), 'Great post')
    await user.click(screen.getByTestId('comment-submit'))
    expect(within(screen.getByTestId('comment-list')).getByText('Great post')).toBeInTheDocument()
  })

  it('clears the comment input after submitting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    const input = screen.getByTestId('comment-input') as HTMLInputElement
    await user.type(input, 'Clear me')
    await user.click(screen.getByTestId('comment-submit'))
    expect(input.value).toBe('')
  })

  it('ignores a blank comment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    const before = within(screen.getByTestId('comment-list')).getAllByRole('listitem').length
    await user.type(screen.getByTestId('comment-input'), '   ')
    await user.click(screen.getByTestId('comment-submit'))
    const after = within(screen.getByTestId('comment-list')).getAllByRole('listitem').length
    expect(after).toBe(before)
  })

  it('likes the post from the detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    expect(screen.getByTestId('detail-likes')).toHaveTextContent('3')
    await user.click(screen.getByTestId('detail-like'))
    expect(screen.getByTestId('detail-likes')).toHaveTextContent('4')
  })
})
