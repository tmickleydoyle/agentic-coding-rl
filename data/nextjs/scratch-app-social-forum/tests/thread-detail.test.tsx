import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('thread detail', () => {
  it('shows a no-thread message when navigating directly without selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-thread'))
    expect(screen.getByTestId('no-thread-selected')).toBeInTheDocument()
  })

  it('lists only the replies for the opened thread', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t1'))
    const list = screen.getByTestId('reply-list')
    expect(within(list).getByText('Hi there!')).toBeInTheDocument()
    expect(within(list).getByText('Me too')).toBeInTheDocument()
    expect(within(list).queryByText('Try the CLI')).not.toBeInTheDocument()
  })

  it('upvotes the thread from the detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t2'))
    expect(screen.getByTestId('detail-votes')).toHaveTextContent('2')
    await user.click(screen.getByTestId('detail-upvote'))
    expect(screen.getByTestId('detail-votes')).toHaveTextContent('3')
  })

  it('upvotes a reply', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t2'))
    expect(screen.getByTestId('reply-r2-votes')).toHaveTextContent('3')
    await user.click(screen.getByTestId('upvote-reply-r2'))
    expect(screen.getByTestId('reply-r2-votes')).toHaveTextContent('4')
  })

  it('adds a reply to the thread', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t2'))
    await user.type(screen.getByTestId('reply-input'), 'Thanks for the tip')
    await user.click(screen.getByTestId('reply-submit'))
    expect(within(screen.getByTestId('reply-list')).getByText('Thanks for the tip')).toBeInTheDocument()
  })

  it('clears the reply input after submitting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t1'))
    const input = screen.getByTestId('reply-input') as HTMLInputElement
    await user.type(input, 'Clear me')
    await user.click(screen.getByTestId('reply-submit'))
    expect(input.value).toBe('')
  })

  it('ignores a blank reply', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t1'))
    const before = within(screen.getByTestId('reply-list')).getAllByRole('listitem').length
    await user.type(screen.getByTestId('reply-input'), '   ')
    await user.click(screen.getByTestId('reply-submit'))
    const after = within(screen.getByTestId('reply-list')).getAllByRole('listitem').length
    expect(after).toBe(before)
  })
})
