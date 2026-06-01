import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('rooms flow', () => {
  it('lists the seeded rooms', () => {
    render(<App />)
    const list = screen.getByTestId('rooms-list')
    expect(within(list).getByText('General')).toBeInTheDocument()
    expect(within(list).getByText('Random')).toBeInTheDocument()
    expect(within(list).getByText('Dev')).toBeInTheDocument()
  })

  it('shows the seeded unread badge per room', () => {
    render(<App />)
    expect(screen.getByTestId('room-r1-unread')).toHaveTextContent('0')
    expect(screen.getByTestId('room-r2-unread')).toHaveTextContent('2')
  })

  it('shows the room topic', () => {
    render(<App />)
    expect(screen.getByTestId('room-r3-topic')).toHaveTextContent('Engineering')
  })

  it('opens a room and shows its messages', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r1'))
    expect(screen.getByTestId('page-room')).toBeInTheDocument()
    expect(screen.getByTestId('room-title')).toHaveTextContent('General')
    const list = screen.getByTestId('message-list')
    expect(within(list).getByText('Morning all')).toBeInTheDocument()
    expect(within(list).getByText('Hi there')).toBeInTheDocument()
    expect(within(list).queryByText('Lunch?')).not.toBeInTheDocument()
  })

  it('clears a room unread count when opened', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('room-r2-unread')).toHaveTextContent('2')
    await user.click(screen.getByTestId('open-r2'))
    await user.click(screen.getByTestId('nav-rooms'))
    expect(screen.getByTestId('room-r2-unread')).toHaveTextContent('0')
  })

  it('shows no-room message when navigating to room without selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-room'))
    expect(screen.getByTestId('no-room-selected')).toBeInTheDocument()
  })

  it('sends a message into the open room', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r2'))
    await user.type(screen.getByTestId('message-input'), 'Pizza please')
    await user.click(screen.getByTestId('send-submit'))
    expect(within(screen.getByTestId('message-list')).getByText('Pizza please')).toBeInTheDocument()
  })

  it('clears the message input after sending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r2'))
    const input = screen.getByTestId('message-input') as HTMLInputElement
    await user.type(input, 'Clear me')
    await user.click(screen.getByTestId('send-submit'))
    expect(input.value).toBe('')
  })

  it('ignores a blank message', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r1'))
    const before = within(screen.getByTestId('message-list')).getAllByRole('listitem').length
    await user.type(screen.getByTestId('message-input'), '   ')
    await user.click(screen.getByTestId('send-submit'))
    const after = within(screen.getByTestId('message-list')).getAllByRole('listitem').length
    expect(after).toBe(before)
  })

  it('shows the message author handle', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r1'))
    expect(screen.getByTestId('message-m1-author')).toHaveTextContent('@ada')
  })
})
