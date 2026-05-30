import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('members and settings', () => {
  it('lists all members', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('member-u1')).toBeInTheDocument()
    expect(screen.getByTestId('member-u2')).toBeInTheDocument()
    expect(screen.getByTestId('member-u3')).toBeInTheDocument()
  })

  it('shows a member handle', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('member-u2-handle')).toHaveTextContent('@ada')
  })

  it('shows room stats from the seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('stat-rooms')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-messages')).toHaveTextContent('5')
    expect(screen.getByTestId('stat-unread')).toHaveTextContent('2')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('changes the theme from settings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.selectOptions(screen.getByTestId('theme-select'), 'dark')
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('persists the theme across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.selectOptions(screen.getByTestId('theme-select'), 'dark')
    await user.click(screen.getByTestId('nav-rooms'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('marks all rooms read from settings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('settings-unread')).toHaveTextContent('2')
    await user.click(screen.getByTestId('mark-all-read'))
    expect(screen.getByTestId('settings-unread')).toHaveTextContent('0')
  })

  it('reflects cleared unread on the rooms list after mark all read', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('mark-all-read'))
    await user.click(screen.getByTestId('nav-rooms'))
    expect(screen.getByTestId('room-r2-unread')).toHaveTextContent('0')
  })

  it('persists a sent message across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r1'))
    await user.type(screen.getByTestId('message-input'), 'Persisted')
    await user.click(screen.getByTestId('send-submit'))
    await user.click(screen.getByTestId('nav-members'))
    await user.click(screen.getByTestId('nav-rooms'))
    await user.click(screen.getByTestId('open-r1'))
    expect(within(screen.getByTestId('message-list')).getByText('Persisted')).toBeInTheDocument()
  })
})
