import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('channel and thread flow', () => {
  it('lists the seeded messages', () => {
    render(<App />)
    const list = screen.getByTestId('message-list')
    expect(within(list).getByText('Deploy failing')).toBeInTheDocument()
    expect(within(list).getByText('Lunch spot ideas')).toBeInTheDocument()
    expect(within(list).getByText('Docs updated')).toBeInTheDocument()
  })

  it('shows the reply count per message', () => {
    render(<App />)
    expect(screen.getByTestId('message-m1-replies')).toHaveTextContent('3')
    expect(screen.getByTestId('message-m2-replies')).toHaveTextContent('1')
  })

  it('shows the resolved status badge', () => {
    render(<App />)
    expect(screen.getByTestId('message-m1-status')).toHaveTextContent('Open')
    expect(screen.getByTestId('message-m3-status')).toHaveTextContent('Resolved')
  })

  it('shows the message author handle', () => {
    render(<App />)
    expect(screen.getByTestId('message-m1-author')).toHaveTextContent('@ada')
  })

  it('posts a new top-level message', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('post-input'), 'New topic')
    await user.click(screen.getByTestId('post-submit'))
    expect(within(screen.getByTestId('message-list')).getByText('New topic')).toBeInTheDocument()
  })

  it('clears the post input after posting', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByTestId('post-input') as HTMLInputElement
    await user.type(input, 'Clear me')
    await user.click(screen.getByTestId('post-submit'))
    expect(input.value).toBe('')
  })

  it('ignores a blank post', async () => {
    const user = userEvent.setup()
    render(<App />)
    const before = within(screen.getByTestId('message-list')).getAllByRole('listitem').length
    await user.type(screen.getByTestId('post-input'), '   ')
    await user.click(screen.getByTestId('post-submit'))
    const after = within(screen.getByTestId('message-list')).getAllByRole('listitem').length
    expect(after).toBe(before)
  })

  it('opens a thread and shows its replies', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-m1'))
    expect(screen.getByTestId('page-thread')).toBeInTheDocument()
    expect(screen.getByTestId('thread-text')).toHaveTextContent('Deploy failing')
    const list = screen.getByTestId('reply-list')
    expect(within(list).getByText('Looking now')).toBeInTheDocument()
    expect(within(list).getByText('Fixed it')).toBeInTheDocument()
    expect(within(list).queryByText('Tacos')).not.toBeInTheDocument()
  })

  it('shows no-thread message when navigating to thread without selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-thread'))
    expect(screen.getByTestId('no-thread-selected')).toBeInTheDocument()
  })

  it('adds a reply and bumps the reply count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-m2'))
    await user.type(screen.getByTestId('reply-input'), 'Pizza too')
    await user.click(screen.getByTestId('reply-submit'))
    expect(within(screen.getByTestId('reply-list')).getByText('Pizza too')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-channel'))
    expect(screen.getByTestId('message-m2-replies')).toHaveTextContent('2')
  })

  it('ignores a blank reply', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-m1'))
    const before = within(screen.getByTestId('reply-list')).getAllByRole('listitem').length
    await user.type(screen.getByTestId('reply-input'), '   ')
    await user.click(screen.getByTestId('reply-submit'))
    const after = within(screen.getByTestId('reply-list')).getAllByRole('listitem').length
    expect(after).toBe(before)
  })

  it('resolves an open thread and reflects it in the channel', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-m1'))
    expect(screen.getByTestId('thread-status')).toHaveTextContent('Open')
    await user.click(screen.getByTestId('resolve-toggle'))
    expect(screen.getByTestId('thread-status')).toHaveTextContent('Resolved')
    await user.click(screen.getByTestId('nav-channel'))
    expect(screen.getByTestId('message-m1-status')).toHaveTextContent('Resolved')
  })

  it('reopens a resolved thread', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-m3'))
    expect(screen.getByTestId('resolve-toggle')).toHaveTextContent('Reopen')
    await user.click(screen.getByTestId('resolve-toggle'))
    expect(screen.getByTestId('thread-status')).toHaveTextContent('Open')
  })
})
