import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('canned replies and history', () => {
  it('lists canned replies by label', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-canned'))
    expect(screen.getByTestId('canned-k1-label')).toHaveTextContent('Greeting')
    expect(screen.getByTestId('canned-k2-label')).toHaveTextContent('Closing')
  })

  it('disables canned use buttons when no chat is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-canned'))
    expect(screen.getByTestId('use-k1')).toBeDisabled()
  })

  it('enables canned use buttons once a chat is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    await user.click(screen.getByTestId('nav-canned'))
    expect(screen.getByTestId('use-k1')).not.toBeDisabled()
  })

  it('sends a canned reply into the selected chat', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    await user.click(screen.getByTestId('nav-canned'))
    await user.click(screen.getByTestId('use-k1'))
    await user.click(screen.getByTestId('nav-chat'))
    expect(within(screen.getByTestId('reply-list')).getByText('Hi, how can I help?')).toBeInTheDocument()
  })

  it('lists all chats in history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-c1')).toBeInTheDocument()
    expect(screen.getByTestId('history-c2')).toBeInTheDocument()
    expect(screen.getByTestId('history-c3')).toBeInTheDocument()
  })

  it('shows the chat status in history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-c3-status')).toHaveTextContent('closed')
  })

  it('shows support stats from the seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('stat-total')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-open')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-closed')).toHaveTextContent('1')
  })

  it('defaults to light theme and switches to dark', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-history'))
    await user.selectOptions(screen.getByTestId('theme-select'), 'dark')
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('updates history stats after closing a chat', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    await user.click(screen.getByTestId('close-toggle'))
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('stat-open')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-closed')).toHaveTextContent('2')
  })
})
