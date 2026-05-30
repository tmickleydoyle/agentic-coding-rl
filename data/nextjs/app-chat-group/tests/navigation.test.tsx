import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the chats page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-chats')).toBeInTheDocument()
    expect(screen.getByTestId('nav-chats')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-members')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the members page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('page-members')).toBeInTheDocument()
    expect(screen.getByTestId('nav-members')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-chats')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the create page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
    expect(screen.getByTestId('nav-create')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to chat-detail then back to chats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-chat-detail'))
    expect(screen.getByTestId('page-chat-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-chats'))
    expect(screen.getByTestId('page-chats')).toBeInTheDocument()
    expect(screen.getByTestId('nav-chat-detail')).not.toHaveAttribute('aria-current')
  })
})
