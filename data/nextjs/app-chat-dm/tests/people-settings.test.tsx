import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('people search and settings', () => {
  it('lists all other people by default', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-people'))
    expect(screen.getByTestId('person-u2')).toBeInTheDocument()
    expect(screen.getByTestId('person-u3')).toBeInTheDocument()
    expect(screen.getByTestId('person-u4')).toBeInTheDocument()
    expect(screen.queryByTestId('person-u1')).not.toBeInTheDocument()
  })

  it('filters people by name query', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-people'))
    await user.type(screen.getByTestId('people-search'), 'ada')
    expect(screen.getByTestId('person-u2')).toBeInTheDocument()
    expect(screen.queryByTestId('person-u3')).not.toBeInTheDocument()
  })

  it('filters people by handle query case-insensitively', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-people'))
    await user.type(screen.getByTestId('people-search'), 'LINUS')
    expect(screen.getByTestId('person-u3')).toBeInTheDocument()
    expect(screen.queryByTestId('person-u2')).not.toBeInTheDocument()
  })

  it('shows a no-people message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-people'))
    await user.type(screen.getByTestId('people-search'), 'zzz')
    expect(screen.getByTestId('no-people')).toBeInTheDocument()
    expect(screen.queryByTestId('people-list')).not.toBeInTheDocument()
  })

  it('shows the person handle', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-people'))
    expect(screen.getByTestId('person-u4-handle')).toHaveTextContent('@grace')
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

  it('shows inbox stats from the seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('stat-threads')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-unread')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-messages')).toHaveTextContent('4')
  })

  it('persists a sent DM across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-t1'))
    await user.type(screen.getByTestId('dm-input'), 'Persisted')
    await user.click(screen.getByTestId('send-submit'))
    await user.click(screen.getByTestId('nav-people'))
    await user.click(screen.getByTestId('nav-thread'))
    expect(screen.getByText('Persisted')).toBeInTheDocument()
  })
})
