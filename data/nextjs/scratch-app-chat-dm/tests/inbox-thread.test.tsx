import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('inbox and thread flow', () => {
  it('lists the seeded threads by person name', () => {
    render(<App />)
    const list = screen.getByTestId('thread-list')
    expect(within(list).getByText('Ada')).toBeInTheDocument()
    expect(within(list).getByText('Linus')).toBeInTheDocument()
    expect(within(list).getByText('Grace')).toBeInTheDocument()
  })

  it('shows the seeded unread badges', () => {
    render(<App />)
    expect(screen.getByTestId('thread-t1-unread')).toHaveTextContent('Unread')
    expect(screen.getByTestId('thread-t2-unread')).toHaveTextContent('Read')
  })

  it('shows the unread thread count', () => {
    render(<App />)
    expect(screen.getByTestId('inbox-unread-count')).toHaveTextContent('2')
  })

  it('opens a thread and shows its DMs', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t1'))
    expect(screen.getByTestId('page-thread')).toBeInTheDocument()
    expect(screen.getByTestId('thread-title')).toHaveTextContent('Ada')
    const list = screen.getByTestId('dm-list')
    expect(within(list).getByText('Hey there')).toBeInTheDocument()
    expect(within(list).getByText('Hi Ada')).toBeInTheDocument()
    expect(within(list).queryByText('Ship it')).not.toBeInTheDocument()
  })

  it('marks a thread read when opened', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('thread-t1-unread')).toHaveTextContent('Unread')
    await user.click(screen.getByTestId('open-t1'))
    await user.click(screen.getByTestId('nav-inbox'))
    expect(screen.getByTestId('thread-t1-unread')).toHaveTextContent('Read')
    expect(screen.getByTestId('inbox-unread-count')).toHaveTextContent('1')
  })

  it('shows no-thread message when navigating to thread without selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-thread'))
    expect(screen.getByTestId('no-thread-selected')).toBeInTheDocument()
  })

  it('sends a DM into the open thread', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t1'))
    await user.type(screen.getByTestId('dm-input'), 'See you soon')
    await user.click(screen.getByTestId('send-submit'))
    expect(within(screen.getByTestId('dm-list')).getByText('See you soon')).toBeInTheDocument()
  })

  it('clears the DM input after sending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t1'))
    const input = screen.getByTestId('dm-input') as HTMLInputElement
    await user.type(input, 'Clear me')
    await user.click(screen.getByTestId('send-submit'))
    expect(input.value).toBe('')
  })

  it('ignores a blank DM', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t1'))
    const before = within(screen.getByTestId('dm-list')).getAllByRole('listitem').length
    await user.type(screen.getByTestId('dm-input'), '   ')
    await user.click(screen.getByTestId('send-submit'))
    const after = within(screen.getByTestId('dm-list')).getAllByRole('listitem').length
    expect(after).toBe(before)
  })

  it('marks an opened thread unread again from the thread view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t2'))
    await user.click(screen.getByTestId('mark-unread'))
    await user.click(screen.getByTestId('nav-inbox'))
    expect(screen.getByTestId('thread-t2-unread')).toHaveTextContent('Unread')
  })

  it('shows the DM author handle', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t1'))
    expect(screen.getByTestId('dm-d1-author')).toHaveTextContent('@ada')
  })
})
