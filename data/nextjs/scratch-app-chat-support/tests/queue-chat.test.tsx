import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('queue and chat flow', () => {
  it('lists only open chats in the queue', () => {
    render(<App />)
    const list = screen.getByTestId('queue-list')
    expect(within(list).getByText('Alice')).toBeInTheDocument()
    expect(within(list).getByText('Bob')).toBeInTheDocument()
    expect(within(list).queryByText('Cara')).not.toBeInTheDocument()
  })

  it('shows the open chat count', () => {
    render(<App />)
    expect(screen.getByTestId('queue-count')).toHaveTextContent('2')
  })

  it('opens a chat and shows its replies', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    expect(screen.getByTestId('page-chat')).toBeInTheDocument()
    expect(screen.getByTestId('chat-title')).toHaveTextContent('Alice')
    const list = screen.getByTestId('reply-list')
    expect(within(list).getByText('My order is late')).toBeInTheDocument()
    expect(within(list).getByText('Let me check')).toBeInTheDocument()
    expect(within(list).queryByText('All sorted')).not.toBeInTheDocument()
  })

  it('shows no-chat message when navigating to chat without selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-chat'))
    expect(screen.getByTestId('no-chat-selected')).toBeInTheDocument()
  })

  it('sends a reply into the open chat', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    await user.type(screen.getByTestId('reply-input'), 'On its way')
    await user.click(screen.getByTestId('send-submit'))
    expect(within(screen.getByTestId('reply-list')).getByText('On its way')).toBeInTheDocument()
  })

  it('clears the reply input after sending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    const input = screen.getByTestId('reply-input') as HTMLInputElement
    await user.type(input, 'Clear me')
    await user.click(screen.getByTestId('send-submit'))
    expect(input.value).toBe('')
  })

  it('ignores a blank reply', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    const before = within(screen.getByTestId('reply-list')).getAllByRole('listitem').length
    await user.type(screen.getByTestId('reply-input'), '   ')
    await user.click(screen.getByTestId('send-submit'))
    const after = within(screen.getByTestId('reply-list')).getAllByRole('listitem').length
    expect(after).toBe(before)
  })

  it('closes an open chat and removes it from the queue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    expect(screen.getByTestId('chat-status')).toHaveTextContent('open')
    await user.click(screen.getByTestId('close-toggle'))
    expect(screen.getByTestId('chat-status')).toHaveTextContent('closed')
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.queryByTestId('chat-c1')).not.toBeInTheDocument()
    expect(screen.getByTestId('queue-count')).toHaveTextContent('1')
  })

  it('reopens a closed chat from the chat view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    await user.click(screen.getByTestId('close-toggle'))
    expect(screen.getByTestId('close-toggle')).toHaveTextContent('Reopen')
    await user.click(screen.getByTestId('close-toggle'))
    expect(screen.getByTestId('chat-status')).toHaveTextContent('open')
  })

  it('assigns an agent to the chat', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c2'))
    const select = screen.getByTestId('assign-select') as HTMLSelectElement
    expect(select.value).toBe('')
    await user.selectOptions(select, 'a2')
    expect((screen.getByTestId('assign-select') as HTMLSelectElement).value).toBe('a2')
  })

  it('reflects the seeded assigned agent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    expect((screen.getByTestId('assign-select') as HTMLSelectElement).value).toBe('a1')
  })
})
