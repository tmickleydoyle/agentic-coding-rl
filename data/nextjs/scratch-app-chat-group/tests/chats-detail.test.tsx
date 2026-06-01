import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('chats and detail flow', () => {
  it('lists only the current user groups', () => {
    render(<App />)
    const list = screen.getByTestId('chats-list')
    expect(within(list).getByText('Weekend Plans')).toBeInTheDocument()
    expect(within(list).getByText('Book Club')).toBeInTheDocument()
    expect(within(list).queryByText('Founders')).not.toBeInTheDocument()
  })

  it('shows the current user group count', () => {
    render(<App />)
    expect(screen.getByTestId('chats-count')).toHaveTextContent('2')
  })

  it('shows the member count per group', () => {
    render(<App />)
    expect(screen.getByTestId('group-g1-count')).toHaveTextContent('3')
  })

  it('opens a group and shows its members and admin', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    expect(screen.getByTestId('page-chat-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Weekend Plans')
    expect(screen.getByTestId('detail-admin')).toHaveTextContent('You')
    expect(screen.getByTestId('member-u1')).toBeInTheDocument()
    expect(screen.getByTestId('member-u2')).toBeInTheDocument()
    expect(screen.getByTestId('member-u3')).toBeInTheDocument()
  })

  it('shows no-group message when navigating to detail without selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-chat-detail'))
    expect(screen.getByTestId('no-group-selected')).toBeInTheDocument()
  })

  it('does not render a remove button for the admin', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    expect(screen.queryByTestId('remove-u1')).not.toBeInTheDocument()
    expect(screen.getByTestId('remove-u2')).toBeInTheDocument()
  })

  it('removes a non-admin member', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    await user.click(screen.getByTestId('remove-u2'))
    expect(screen.queryByTestId('member-u2')).not.toBeInTheDocument()
    expect(screen.getByTestId('member-u3')).toBeInTheDocument()
  })

  it('adds a member from the select', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    expect(screen.queryByTestId('member-u4')).not.toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('add-select'), 'u4')
    await user.click(screen.getByTestId('add-submit'))
    expect(screen.getByTestId('member-u4')).toBeInTheDocument()
  })

  it('hides the leave button for an admin-owned group', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    expect(screen.queryByTestId('leave-group')).not.toBeInTheDocument()
  })

  it('shows the leave button for a group the user does not administer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g2'))
    expect(screen.getByTestId('leave-group')).toBeInTheDocument()
  })

  it('leaves a non-admin group and removes it from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g2'))
    await user.click(screen.getByTestId('leave-group'))
    await user.click(screen.getByTestId('nav-chats'))
    expect(screen.queryByTestId('group-g2')).not.toBeInTheDocument()
    expect(screen.getByTestId('chats-count')).toHaveTextContent('1')
  })
})
