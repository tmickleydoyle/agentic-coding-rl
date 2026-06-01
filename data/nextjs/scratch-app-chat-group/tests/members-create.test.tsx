import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('members directory and create', () => {
  it('lists all people in the directory', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('person-u1')).toBeInTheDocument()
    expect(screen.getByTestId('person-u2')).toBeInTheDocument()
    expect(screen.getByTestId('person-u3')).toBeInTheDocument()
    expect(screen.getByTestId('person-u4')).toBeInTheDocument()
  })

  it('shows a person name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('person-u4-name')).toHaveTextContent('Grace')
  })

  it('shows group stats from the seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('stat-total')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-mine')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-admin')).toHaveTextContent('1')
  })

  it('defaults to light theme and switches to dark', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-create'))
    await user.selectOptions(screen.getByTestId('theme-select'), 'dark')
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('creates a group and opens its detail as admin', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('name-input'), 'Lunch Crew')
    await user.click(screen.getByTestId('create-submit'))
    expect(screen.getByTestId('page-chat-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Lunch Crew')
    expect(screen.getByTestId('detail-admin')).toHaveTextContent('You')
    expect(screen.getByTestId('member-u1')).toBeInTheDocument()
  })

  it('ignores a blank group name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('name-input'), '   ')
    await user.click(screen.getByTestId('create-submit'))
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
  })

  it('shows the new group in the chats list and bumps stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('name-input'), 'Lunch Crew')
    await user.click(screen.getByTestId('create-submit'))
    await user.click(screen.getByTestId('nav-chats'))
    expect(screen.getByText('Lunch Crew')).toBeInTheDocument()
    expect(screen.getByTestId('chats-count')).toHaveTextContent('3')
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('stat-admin')).toHaveTextContent('2')
  })

  it('persists an added member across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-g1'))
    await user.selectOptions(screen.getByTestId('add-select'), 'u4')
    await user.click(screen.getByTestId('add-submit'))
    await user.click(screen.getByTestId('nav-members'))
    await user.click(screen.getByTestId('nav-chat-detail'))
    expect(screen.getByTestId('member-u4')).toBeInTheDocument()
  })
})
