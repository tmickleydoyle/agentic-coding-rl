import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationCenter from '../components/NotificationCenter'

const NOTES = [
  { id: 'a', text: 'Welcome' },
  { id: 'b', text: 'New message' },
  { id: 'c', text: 'Reminder' },
]

describe('NotificationCenter', () => {
  it('starts in inbox with unread count == total', () => {
    render(<NotificationCenter notifications={NOTES} />)
    expect(screen.getByTestId('inbox')).toBeInTheDocument()
    expect(screen.getByTestId('unread')).toHaveTextContent('3')
    expect(screen.queryByTestId('reading')).toBeNull()
  })

  it('opening a notification switches to reader view', async () => {
    const user = userEvent.setup()
    render(<NotificationCenter notifications={NOTES} />)
    await user.click(screen.getByTestId('open-b'))
    expect(screen.queryByTestId('inbox')).toBeNull()
    expect(screen.getByTestId('reading')).toHaveTextContent('New message')
    expect(screen.getByTestId('back')).toBeInTheDocument()
  })

  it('back returns to inbox; unread count decreased by 1', async () => {
    const user = userEvent.setup()
    render(<NotificationCenter notifications={NOTES} />)
    await user.click(screen.getByTestId('open-b'))
    await user.click(screen.getByTestId('back'))
    expect(screen.getByTestId('inbox')).toBeInTheDocument()
    expect(screen.getByTestId('unread')).toHaveTextContent('2')
  })

  it('opening the same notification again does NOT decrement', async () => {
    const user = userEvent.setup()
    render(<NotificationCenter notifications={NOTES} />)
    await user.click(screen.getByTestId('open-a'))
    await user.click(screen.getByTestId('back'))
    await user.click(screen.getByTestId('open-a'))
    await user.click(screen.getByTestId('back'))
    expect(screen.getByTestId('unread')).toHaveTextContent('2')
  })

  it('opening all marks unread = 0', async () => {
    const user = userEvent.setup()
    render(<NotificationCenter notifications={NOTES} />)
    for (const id of ['a', 'b', 'c']) {
      await user.click(screen.getByTestId(`open-${id}`))
      await user.click(screen.getByTestId('back'))
    }
    expect(screen.getByTestId('unread')).toHaveTextContent('0')
  })
})
